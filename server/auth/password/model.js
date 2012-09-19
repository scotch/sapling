
var error = require('../../error')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , getByUserId;

var PASSWORD_LENGTH_MIN = 4;
var PASSWORD_LENGTH_MAX = 34;
var BCRYPT_COST = 10;


var passwordSchema = new Schema({
  userId : Schema.ObjectId,
  provider: {type: String, default: 'local'},
  passwordHash: String,
  created: Date,
});

var Password = mongoose.model('Password', passwordSchema);

Password.schema.path('created')
  .default(function () {
    return new Date();
  })
  .set(function(v){
    return v === 'now' ? new Date() : v;
  });

exports.create = function (userId, passwordRaw, callback) {

  // confirm the the length of the password is valid
  if (passwordRaw.length <= PASSWORD_LENGTH_MIN || passwordRaw.length >= PASSWORD_LENGTH_MAX) {
    return callback(error.invalidPasswordLengthError, null);
  }
  // check for existing account.
  // TODO
  // no entity so lets create one
  // encrypt the password using bcrypt
  bcrypt.hash(passwordRaw, BCRYPT_COST, function (err, hash) {
    if (err) {
      return callback(err, null);
    }
    var p = Password();
//    p.userId = userId;
    p.passwordHash = hash;
    p.save(function (err) {
      return callback(err, p);
    });
  });
};

exports.getByUserId = getByUserId = function (userId, callback) {
  Password.findOne({userId: userId}, callback);
};

exports.authenticate = function (userId, pass, callback) {

  getByUserId(userId, function (err, p) {
    if (!p) {
      callback(err, false);
    } else {
      bcrypt.compare(p.passwordHash, pass, function (err, res) {
        if (res) {
          callback(null, p);
        } else {
          callback(error.invalidPasswordError, null);
        }
      });
    }
  });
};