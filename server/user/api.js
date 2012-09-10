/**
 * GET users listing.
 **/

var user = require("./model");

exports.create = function(req, res) {
  // Create a signed cookie
  u = {
    'name': {
      'givenName': 'Kyle',
      'familyName': 'Finley'
    }
  };

  user.createAndLogin(res, u, function (err, u) {
    res.send(u);
  });

};

exports.current = function(req, res) {
  user.current(req, function(err, u) {
    res.send(u);
  });
};