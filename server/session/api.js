/*
 * GET session listing.
 */

exports.list = function(req, res) {
  // Send the session back
  req.session["hello"] = "world";
  req.send(req.session);
};