
var error = require('../../error')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , getByUserId;

var PASSWORD_LENGTH_MIN = 4;
var PASSWORD_LENGTH_MAX = 34;
var BCRYPT_COST = 10;


var passwordSchema = new Schema({
  userId : { type: Schema.ObjectId, unique: true, required: true },
  provider: { type: String, default: 'local' },
  passwordHash: String,
  created: Date,
});

passwordSchema.path('created')
  .default(function () {
    return new Date();
  })
  .set(function(v){
    return v === 'now' ? new Date() : v;
  });

passwordSchema.statics.new = function (userId, passwordRaw, callback) {

  // To speed up tests
  if (process.env.NODE_ENV === 'test') {
    BCRYPT_COST = 1;
  }

  // confirm the the length of the password is valid
  if (passwordRaw.length <= PASSWORD_LENGTH_MIN || passwordRaw.length >= PASSWORD_LENGTH_MAX) {
    return callback(error.invalidPasswordLengthError, null);
  }

  // no entity so lets create one
  // encrypt the password using bcrypt
  bcrypt.hash(passwordRaw, BCRYPT_COST, function (err, hash) {
    if (err) {
      return callback(err, null);
    }
    var p = Password();
    p.userId = userId;
    p.passwordHash = hash;
    p.save(function (err) {
      return callback(err, p);
    });
  });
};

passwordSchema.statics.getByUserId = getByUserId = function (userId, callback) {
  Password.findOne({userId: userId}, callback);
};

passwordSchema.statics.authenticate = function (userId, pass, callback) {
  Password.findOne({userId: userId}, function (err, p) {
    if (!p) {
      callback(err, false);
    } else {

      bcrypt.compare(pass, p.passwordHash, callback);
    }
  });
};

var Password = mongoose.model('Password', passwordSchema);

exports.Password = Password;