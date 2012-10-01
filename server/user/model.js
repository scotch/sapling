'use strict';

// Imports
var ds = require('../ds');
var bcrypt = require('bcrypt');
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
  value   : { type: String, required: true, lowercase: true, trim: true},
  type    : { type: String },
  status  : { type: Number, default: 0 },
});

//emailSchema.path('created')
  //.default(function () {
    //return new Date();
  //})
  //.set(function (v) {
    //return v === 'now' ? new Date() : v;
  //});

emailSchema.path('value')
  .validate(function (value) {
    return utils.validateEmail(value);
  }, 'Invalid address');

var userSchema = new Schema({
  profile: {
    name  : {
      givenName   : String,
      familyName  : String,
      middleName  : String
    },
    username: String,
    emails : [emailSchema],
  }
});

// Statics
userSchema.statics.createFromProfile = function (p, fn) {
  var u = new User();
  u.profile = p;
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
  var isValid = utils.validateEmail(username);
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

exports.Email = Email = mongoose.model('Email', emailSchema);
exports.User = User = mongoose.model('User', userSchema);
