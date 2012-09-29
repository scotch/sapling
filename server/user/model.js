'use strict';

// Imports
var ds = require('../ds');
var bcrypt = require('bcrypt');
var emailUtils = require('../email/utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('./utils');

// Variables
var Email;
var User;

// Constants
var UNVERIFIED = 0;
var PENDING = 1;
var VERIFIED = 2;
var PRIMARY = 3;


var emailSchema = new Schema({
  address : { type: String, required: true, lowercase: true, trim: true},
  status  : { type: Number, default: 0 },
  created : Date,
});

emailSchema.path('created')
  .default(function () {
    return new Date();
  })
  .set(function (v) {
    return v === 'now' ? new Date() : v;
  });

emailSchema.path('address')
  .validate(function (value) {
    return utils.validateEmail(value);
  }, 'Invalid address');

var userSchema = new Schema({
  emails : [emailSchema],
  name  : {
    givenName   : String,
    familyName  : String,
    middleName  : String
  },
  username: String,
});

userSchema.statics.findByEmail = function (address, fn) {
  User.findOne({'emails.address': address}, fn);
};

userSchema.statics.findByUsername = function (username, fn) {
  User.findOne({username: username}, fn);
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

userSchema.methods.addEmail = function (address, fn) {
  var e = new Email({
    address: address,
  });
  this.emails.push(e);
  this.save(fn);
};

exports.Email = Email = mongoose.model('Email', emailSchema);
exports.User = User = mongoose.model('User', userSchema);
