'use strict';

// Imports
var ds = require('../ds');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var emailUtils = require('../email/utils');
var Email = require('../email/model').Email;

// Variables
var User;


var userSchema = new Schema({
  profile: {
    name  : {
      givenName   : String,
      familyName  : String,
      middleName  : String
    },
    username: String,
    emails : [Email.schema],
  }
});

// Statics
userSchema.statics.createFromProfile = function (p, fn) {
  var u = new User();
  u.profile = p;
  if (p.email) {
    if (!u.profile.emails) {
      u.profile.emails = [];
    }
    var e = new Email({
      value: p.email,
    });
    u.profile.emails.push(e);
  }
  u.save(fn);
};

userSchema.statics.findByEmail = function (address, fn) {
  User.findOne({'profile.emails.value': address}, fn);
};

userSchema.statics.findByUsername = function (username, fn) {
  User.findOne({'profile.username': username}, fn);
};

userSchema.statics.findByEmailOrUsername = function (username, fn) {
  // Determine if we have an email address or a username
  var isValid = emailUtils.validateEmail(username);
  if (isValid) {
    User.findByEmail(username, fn);
  } else {
    User.findByUsername(username, fn);
  }
};

// Methods
userSchema.methods.addEmail = function (address, fn) {
  var e = new Email({
    value: address,
  });
  this.profile.emails.push(e);
  this.save(fn);
};

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  //delete obj.password;
  //delete obj.salt;
  return obj;
}

// getProfile is a hack to get return virtual properties.
userSchema.methods.getProfile = function () {
  return this.toObject().profile;
};

// Virtuals
userSchema.virtual('profile.id')
  .get(function (username, fn) {
    return this._id;
  });


userSchema.set('toObject', { getters: true });
userSchema.set('toJSON', { getters: true });


exports.User = User = mongoose.model('User', userSchema);
