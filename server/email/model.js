var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    utils = require('./utils');


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
  .set(function(v){
    return v === 'now' ? new Date() : v;
  });

emailSchema.path('address')
    .validate(function (value) {
      return utils.validateEmail(value);
    }, 'Invalid address');

emailSchema.statics.new = function (email, status, callback) {
  var e = new Email();
  e._id = email;
  e.address = email;
  e.status = status;
  e.save(function (err) {
    return callback(err, e);
  });
};

emailSchema.statics.get = function (email, callback) {
  Email.findOne({_id: email}, function (err, e) {
    return callback(err, e);
  });
};


var Email = mongoose.model('Email', emailSchema);


exports.Email = Email;


