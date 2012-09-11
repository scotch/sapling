/**
 * User API Routes.
 */

var user = require("./model");

// PUT */user
exports.create = function(req, res) {
  // Create a new user
  user.create(req.body, function (err, u) {
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
    req.session.userId = u.id;
    // strip passwordHash -- we don't want to return it to the client
    delete u.passwordHash;
    // send the newly created user back to the client.
    res.send(u);
  });
};

// GET */user/{id}
exports.read = function(req, res) {
  // get the user by the user id.
  user.read(req.params.userId, function (err, u) {
    // strip passwordHash -- we don't want to return it to the client
    delete u.passwordHash;
    // send the found user back to the client
    res.send(u);
  });
};

// PUT */user/{id}
exports.update = function(req, res) {
  // get the user by the user id.
  user.update(req.params.userId, req.body, function (err, u) {
    // strip passwordHash -- we don't want to return it to the client
    delete u.passwordHash;
    // send the found user back to the client
    res.send(u);
  });
};

// DELETE */user/{id}
exports.delete = function(req, res) {
  // get the user by the user id.
  user.delete(req.params.userId, function (err) {
    // send the found user back to the client
    res.send();
  });
};

// GET */user/me
exports.current = function(req, res) {
  // get the user by the user id stored in the session
  user.read(req.session.userId, function (err, u) {
    if (u) {
      // strip passwordHash -- we don't want to return it to the client
      delete u.passwordHash;
    }
    // send the found user back to the client
    res.send(u || {});
  });
};