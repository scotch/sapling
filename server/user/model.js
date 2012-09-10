
var users = [];
var count = 1;

var COOKIE_NAME = 'sauser';
var COOKIE_LIFE = 30*24*3600*1000;

exports.current = function (res, callback) {
  var userId = res.signedCookies.sauser;
  if (!userId) {
    callback(null, null);
  }
  var u = users[userId];
  callback(null, u);
};

exports.createAndLogin = function (res, user, callback) {
  user.id = String(count);
  users[user.id] = user;
  // Create a cookie to store the user id
  res.cookie(COOKIE_NAME, user.id, { maxAge: COOKIE_LIFE, httpOnly: true, signed: true });
  // increment the user id count
  count++;
  callback(null, user);
};

exports.findById = function (id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
};

exports.findByUsername = function (username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

