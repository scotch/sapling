/*
 * GET users listing.
 */

exports.list = function(req, res) {
  // Create a signed cookie
  var thirtyDays = 30*24*3600*1000;
  res.cookie('sapling.user', '1', { maxAge: thirtyDays, httpOnly: true, signed: true });

  res.send({ user: 'tobi' });
};