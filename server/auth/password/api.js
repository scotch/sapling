'use strict';

// POST */auth/password
exports.list = function (req, res, fn) {
  if (!req.user) {
    return res.send(401);
  }
  var p = {
    isSet: false,
  };
  return res.send(p);
};
