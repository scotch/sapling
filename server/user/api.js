'use strict';

/**
 * User API Routes.
 */

var user = require("./model");

// GET */users
exports.list = function (req, res) {
  res.send('not implemented');
};

// PUT */users
exports.create = function (req, res) {
  // Create a new user
  user.User.createFromProfile(req.body, function (err, u) {
    //console.log('err: ', err);
    //console.log('user: ', u.toObject());
    if (err) {
      // TODO handle server error
      // if invalid request send 400 Bad Request along with error.
      // E.g.
      // {
      //  code: 10,
      //  message: 'invalid email'
      // }
      return res.send(400, err);
    }
    // Add the user id to the session
    //req.session.userId = u.id;
    // strip passwordHash -- we don't want to return it to the client
    //delete u.passwordHash;
    // send the newly created user back to the client.
    return res.send(201, u.getProfile());
  });
};

// GET */users/{id}
exports.read = function (req, res) {
  // get the user by the user id.
  user.User.findById(req.params.userId, function (err, u) {
    // send the found user back to the client
    return res.send(u.getProfile());
  });
};

// PUT */users/{id}
exports.update = function (req, res) {
  // get the user by the user id.
  // a user can only update their own entity
  // TODO admin should be able to modify all.
  if (!req.session.userId || (String(req.session.userId) !== String(req.params.userId))) {
    return res.send(403); // forbidden
  }
  user.update(req.params.userId, req.body, function (err, u) {
    // strip passwordHash -- we don't want to return it to the client
    delete u.passwordHash;
    // send the found user back to the client
    return res.send(u);
  });
};

// DELETE */users/{id}
exports.delete = function (req, res) {
  // get the user by the user id.
  user.delete(req.params.userId, function (err) {
    // send the found user back to the client
    return res.send();
  });
};

// GET */users/me
exports.current = function (req, res) {
  // if there is no userId return not found 401 Unauthorized
  if (!req.session.userId) {
    return res.send(401); // Unauthorized
  }
  // get the user by the user id stored in the session
  user.read(req.session.userId, function (err, u) {
    if (u) {
      // strip passwordHash -- we don't want to return it to the client
      delete u.passwordHash;
    }
    // send the found user back to the client
    return res.send(u || {});
  });
};
