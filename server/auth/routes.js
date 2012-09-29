'use strict';

var passport = require('passport');
var user = require('../user/model');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, fn) {
  fn(null, user.id);
});

passport.deserializeUser(function (id, fn) {
  user.User.findById(id, function (err, user) {
    fn(err, user);
  });
});

// GET */logout
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};
