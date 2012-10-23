'use strict';

/**
 * auth/local provides routes for POST authentication.
 */

var config = require("../../config");
var passport = require('passport');
var model = require('./model');
var user = require('../../user/model');
var LocalStrategy = require('passport-local').Strategy;


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function (username, password, fn) {
    user.User.findByEmailOrUsername(username, function (err, usr) {
      if (err) {
        return fn(err, false, {message: 'An Error occured'});
      }
      if (!usr) {
        return fn(err, false, {message: 'Unknown user ' + username});
      }
      model.Password.authenticate(usr._id, password, function (err, valid) {
        if (err) {
          return fn(err);
        }
        if (!valid) {
          return fn(null, false, {message: 'Invalid Password'});
        }
        return fn(err, usr);
      });
    });
  }
));


// POST */auth/password
exports.start = function (req, res, fn) {
  //console.log('req: ', req);
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return fn(err);
    }
    if (!user) {
      return res.redirect(config.auth.FAILURE_REDIRECT_URL);
    }

    req.logIn(user, function (err) {
      if (err) {
        return fn(err);
      }
      return res.redirect(config.auth.SUCCESS_REDIRECT_URL);
    });
  })(req, res, fn);
};
