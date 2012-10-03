'use strict';
var errors = require('../../errors');
var emailUtils = require('../../email/utils');
var User = require('../../user/model').User;


// GET */auth/password
exports.list = function (req, res, fn) {
  if (!req.user) {
    return res.send(401);
  }
  var p = {
    isSet: false,
  };
  return res.send(p);
};

// POST */auth/password
exports.create = function (req, res, fn) {
  // validate
  var user = req.body.user;
  var password = req.body.password;
  if (!password) {
    return res.send(400, errors.invalidPasswordLengthError);
  }
  if (!user.email) {
    var emailIsValid = emailUtils.validateEmail(user.email);
    if (!emailIsValid) {
      return res.send(400, errors.invalidEmailError);
    }
  }
  // Create user
  User.createFromProfile(user, function (err, u) {
    return res.send(201, u.getProfile());
  });
};
