/*
 * Session Api handlers.
 */

var user = require('../user/model');


// PUT */session
exports.create = function (req, res) {
  user.authenticate(res.body.email, res.body.password.current, function (err, user) {
    if (err) {
      // send error.
      res.send(401);
    } else {
      // Add the user.id to the session.
      req.session.userId = user.id;
      // send the newly created session back to the client.
      res.send(req.session);
    }
  });
};

// GET */session/{id}
//exports.read = function(req, res) {
//  // get the session by the session id.
//  session.read(req.params.sessionId, function (err, u) {
//    // send the found session back to the client
//    res.send(u);
//  });
//};

// PUT */session/{id}
exports.update = function (req, res) {
  // overwrite the current session, but ensure that the userId doesn't change.
  var userId = req.session.userId;
  req.session = req.body;
  req.session.userId = userId;
  return req.session;
};

// DELETE */session/{id}
//exports.delete = function(req, res) {
//  // get the session by the session id.
//  session.delete(req.params.sessionId, function (err) {
//    // send the found session back to the client
//    res.send();
//  });
//};

// GET */session/me
exports.current = function (req, res) {
  // return the current session
  req.session.data = req.session.data || {}
  res.send(req.session.data);
};
