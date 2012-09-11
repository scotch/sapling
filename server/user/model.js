var COOKIE_NAME = 'sauser';
var COOKIE_LIFE = 30*24*3600*1000;
var ErrInvalidEmailAddress = new Error('invalid email address');
var ErrPasswordLength = new Error('password must be between 4 and 34 digits');
var ErrAuthenticationFailed = new Error('incorrect email or password');

// Create a cookie to store the session id
//res.cookie(COOKIE_NAME, session.id, { maxAge: COOKIE_LIFE, httpOnly: true, signed: true });

var ds = require('../ds')
  , bcrypt = require('bcrypt')
  , create
  , read;

var validateEmail = function (address) {
  if (address.indexOf('@') === -1) {
    return false;
  }
  if (address.indexOf('.') === -1) {
    return false;
  }
  return true;
};

exports.create = create = function (user, callback) {
  // confirm the email is valid
  if (!validateEmail(user.email)) {
    return callback(ErrInvalidEmailAddress, null);
  }
  // confirm the the length of the password is valid
  if (user.password.new.length < 4 || user.password.new.length > 34) {
    return callback(ErrPasswordLength, null);
  }
  // encrypt the password using bcrypt
  bcrypt.hash(user.password.new, 12, function (err, hash) {
    if (err) {
      return callback(err, null);
    }
    user.passwordHash = hash;
    // strip plain text password.
    user.password.new = '';
    user.password.current = '';
    user.password.isSet = true;
    // Save the user object. We save an object
    ds.create('User', user, function (err, u)  {
      return callback(err, user);
    });
  });
};

exports.read = read = function (id, callback) {
  ds.read('User', id, callback);
};

exports.authenticate = function (email, pass, callback) {

  ds.findByAttribute('User', 'email', email, function (err, user) {
    if (err) {
      callback(err, false);
    } else {
      bcrypt.compare(user.passwordHash, pass, function (err, res) {
        if (res) {
          callback(null, user);
        } else {
          callback(ErrAuthenticationFailed, null);
        }
      });
    }
  });
};