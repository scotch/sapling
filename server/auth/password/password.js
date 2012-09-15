var ds = require('../../ds')
    , error = require('../../error')
    , bcrypt = require('bcrypt');

var validateEmail = function (address) {
  if (address.indexOf('@') === -1) {
    return false;
  }
  if (address.indexOf('.') === -1) {
    return false;
  }
  return true;
};

var findById = function (id, callback) {
  ds.findById('User', id, callback);
};

var findByEmail = function (email, callback) {
  ds.findByAttribute('Password', 'email', email, callback);
};

var updateUser = function (id, user, callback) {
  ds.update('User', id, user, callback);
};

exports.create = function (obj, callback) {
  // confirm the email is valid
  if (!validateEmail(obj.email)) {
    return callback(error.invalidEmailError, null);
  }
  // confirm the the length of the password is valid
  if (obj.password.new.length < 4 || obj.password.new.length > 34) {
    return callback(error.invalidPasswordLengthError, null);
  }
  // check for existing account.
  findByEmail(obj.email, function (err, u) {
    if (!err) {
      // no error indicates that an entity was found
      return callback(error.emailInUseError, null);
    }
    // no entity so lets create one
    // encrypt the password using bcrypt
    bcrypt.hash(obj.password.new, 10, function (err, hash) {
      if (err) {
        return callback(err, null);
      }
      obj.passwordHash = hash;
      // strip plain text password.
      obj.password.new = '';
      obj.password.current = '';
      obj.password.isSet = true;
      // Save the user object.
      ds.create('Password', obj, function (err, u)  {
        return callback(err, obj);
      });
    });
  });
};

exports.read = function (id, callback) {
  ds.findById('User', id, callback);
};

exports.update = function (id, user, callback) {

  // check for existing account.
  findById(id, function (err, u) {

    if (err) {
      // An error indicates that an entity was not found
      return callback(error.notFoundError, null);
    }
    // updated entity
    updateUser(id, user, callback);
  });
};

exports.authenticate = function (email, pass, callback) {

  findByEmail(email, function (err, user) {
    if (err) {
      callback(err, false);
    } else {
      bcrypt.compare(user.passwordHash, pass, function (err, res) {
        if (res) {
          callback(null, user);
        } else {
          callback(error.invalidPasswordError, null);
        }
      });
    }
  });
};