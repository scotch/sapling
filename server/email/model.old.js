'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('./utils');
var Email;


var emailSchema = new Schema({
  _id     : String,
  address : { type: String, required: true, lowercase: true, trim: true},
  userId  : { type: Schema.ObjectId },
  status  : { type: Number, default: 0 },
  created : Date,
});

emailSchema.path('created')
  .default(function () {
    return new Date();
  })
  .set(function (v) {
    return v === 'now' ? new Date() : v;
  });

emailSchema.path('address')
  .validate(function (value) {
    return utils.validateEmail(value);
  }, 'Invalid address');

emailSchema.statics.new = function (email, status, fn) {
  var e = new Email();
  e._id = email;
  e.address = email;
  e.status = status;
  e.save(function (err) {
    return fn(err, e);
  });
};

emailSchema.statics.get = function (email, fn) {
  Email.findOne({_id: email}, function (err, e) {
    return fn(err, e);
  });
};

exports.Email = Email = mongoose.model('Email', emailSchema);
