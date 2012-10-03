'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('./utils');

// Constants
var UNVERIFIED = 0;
var PENDING = 1;
var VERIFIED = 2;
var PRIMARY = 3;


var emailSchema = new Schema({
  _id     : String,
  value   : { type: String, required: true, lowercase: true, trim: true},
  type    : { type: String },
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

// validate that the email address is valid.
emailSchema.path('value')
  .validate(function (v) {
    return utils.validateEmail(v);
  }, 'Invalid address');

// Set the _id to the value, aka email address for easier look up.
emailSchema.path('_id')
  .get(function (v) {
    return this.value;
  });

emailSchema.virtual('primary')
  .get(function (v) {
    return this.status === 3;
  });

exports.Email = mongoose.model('Email', emailSchema);
