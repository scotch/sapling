/**
 * config provides persisted config. This is useful for config settings that can
 * be set through an admin interface.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    newConfig,
    cnfg = {};

var configSchema = new Schema({
  _id   : String,
  data  : Schema.Types.Mixed,
});

configSchema.statics.new = newConfig = function (id, obj, callback) {
  var c = new Config();
  c._id = id;
  c.data = obj;
  c.save(function (err) {
    return callback(err, c);
  });
};

configSchema.statics.get = function (id, callback) {
  Config.findOne({_id: id}, callback);
};

configSchema.statics.getOrInsert = function (id, obj, callback) {
  Config.findOne({_id: id}, function (err, c) {
    if (c) {
      return callback(err, c);
    } else{
      newConfig(id, obj, callback);
    }
  });
};

var Config = mongoose.model('Config', configSchema);

exports.Config = Config;


