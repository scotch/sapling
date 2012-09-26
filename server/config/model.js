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

configSchema.statics.new = newConfig = function (id, obj, fn) {
  var c = new Config();
  c._id = id;
  c.data = obj;
  c.save(function (err) {
    return fn(err, c);
  });
};

configSchema.statics.get = function (id, fn) {
  Config.findOne({_id: id}, fn);
};

configSchema.statics.getOrInsert = function (id, obj, fn) {
  Config.findOne({_id: id}, function (err, c) {
    if (c) {
      return fn(err, c);
    } else{
      newConfig(id, obj, fn);
    }
  });
};

var Config = mongoose.model('Config', configSchema);

exports.Config = Config;


