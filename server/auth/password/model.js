'use strict';

var errors = require('../../errors');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Password;

// Constants
var PASSWORD_LENGTH_MIN = 4;
var PASSWORD_LENGTH_MAX = 34;
var BCRYPT_COST = 12;


var passwordSchema = new Schema({
  provider: {
    name: { type: String, default: 'local' },
    url: { type: String, default: 'local' },
  },
  auth: {
    passwordHash: String,
  },
  createdAt: Date,
  userId : { type: Schema.ObjectId, unique: true, required: true },
}, { collection: 'authprofiles' });

passwordSchema.path('createdAt')
  .default(function () {
    return new Date();
  })
  .set(function (v) {
    return v === 'now' ? new Date() : v;
  });

passwordSchema.statics.new = function (userId, passwordRaw, fn) {

  // To speed up tests
  if (process.env.NODE_ENV === 'test') {
    BCRYPT_COST = 1;
  }

  // confirm the the length of the password is valid
  if (passwordRaw.length <= PASSWORD_LENGTH_MIN || passwordRaw.length >= PASSWORD_LENGTH_MAX) {
    return fn(errors.invalidPasswordLengthError, null);
  }

  // no entity so lets create one
  // encrypt the password using bcrypt
  bcrypt.hash(passwordRaw, BCRYPT_COST, function (err, hash) {
    if (err) {
      return fn(err, null);
    }
    var p = new Password();
    p.userId = userId;
    p.auth.passwordHash = hash;
    p.save(function (err) {
      return fn(err, p);
    });
  });
};

passwordSchema.statics.getByUserId = function (userId, fn) {
  Password.findOne({userId: userId}, fn);
};

passwordSchema.statics.authenticate = function (userId, pass, fn) {
  Password.findOne({userId: userId}, function (err, p) {
    if (!p) {
      fn(err, false);
    } else {
      bcrypt.compare(pass, p.auth.passwordHash, fn);
    }
  });
};

exports.Password = Password = mongoose.model('Password', passwordSchema);
