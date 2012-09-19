var ds = require('../ds')
  , error = require('../error')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var userSchema = new Schema({
  email : { type: String, required: false, lowercase: true, trim: true},
  emails : { type: String, required: false, lowercase: true, trim: true},
  name  : {
    givenName   : String,
    familyName  : String,
    middleName  : String
  },
});

var User = mongoose.model('User', userSchema);

exports.create = function (user, callback) {
  var u = new User(user);
  u.save(function (err) {
    return callback(err, u);
  });
};

exports.get = function (user, callback) {
  var u = new User(user);
  User.findOne(user, function (err, u) {
    return callback(err, u);
  });
};
