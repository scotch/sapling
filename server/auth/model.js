/**
 * auth provides persisted auth. This is useful for auth settings that can
 * be set through an admin interface.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    genAuthId;


exports.genAuthId = genAuthId = function (provider, id) {
  return provider + '|' + id;
};

var authProfileSchema = new Schema({
  _id         : String,
  userId      : Schema.Types.ObjectId,
  profile : {
    provider  : String,
    id        : String,
    name: {
      givenName   : String,
      familyName  : String
    }
  },
  profileRaw  : Schema.Types.Mixed,
  createdAt   : Date
});

authProfileSchema.path('createdAt')
    .default(function () {
      return new Date();
    })
    .set(function(v){
      return v === 'now' ? new Date() : v;
    });

authProfileSchema.statics.new = function (provider, id, userId, profile, callback) {
  var c = new AuthProfile();
  c._id = genAuthId(provider, id);
  c.userId = userId;
  c.profile = profile;
  c.profile.provider = provider;
  c.profile.id = id;
  c.save(function (err) {
    return callback(err, c);
  });
};

authProfileSchema.statics.get = function (provider, id, callback) {
  AuthProfile.findOne({_id: genAuthId(provider, id)}, callback);
};

var AuthProfile = mongoose.model('AuthProfile', authProfileSchema);

exports.AuthProfile = AuthProfile;