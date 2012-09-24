/**
 * auth/local provides routes for POST authentication.
 */

var config = require("../../config")
  , passport = require('passport');

// POST */password
exports.start = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect(config.FAILURE_REDIRECT_URL);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect(config.SUCCESS_REDIRECT_URL);
    });
  })(req, res, next);
};