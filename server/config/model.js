'use strict';

/**
 * config provides persisted config. This is useful for config settings that can
 * be set through an admin interface.
 */

// TODO: added a layer of persistence, perhaps in instance memory.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config;
var newConfig;

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
    }
    return newConfig(id, obj, fn);
  });
};


exports.Config = Config =  mongoose.model('Config', configSchema);
