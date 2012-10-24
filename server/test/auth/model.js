'use strict';

var utils = require('../utils');
var should = require('should');
var AuthProfile = require('../../auth/model').AuthProfile;


describe('AuthProfile', function () {
  var userId = '000000000000000000000001';
  var profile = {
    name: {
      givenName: 'Bob',
      familyName: 'Dole'
    }
  };
  describe('#new()', function () {
    it('should create a new auth entity when the info is vaild', function (done) {
      AuthProfile["new"]('local', userId, userId, profile, function (err, a) {
        should.not.exist(err);
        should.exist(a._id);
        should.exist(a.createdAt);
        a.profile.provider.should.equal('local');
        a.profile.id.should.equal(userId);
        String(a.userId).should.equal(userId);
        AuthProfile.findOne({
          userId: userId
        }, function (err, u) {
          String(a.userId).should.equal(userId);
          done();
        });
      });
    });
  });
  describe('#get()', function () {
    beforeEach(function (done) {
      AuthProfile["new"]('local', userId, userId, profile, function (err, a) {
        done();
      });
    });
    it('should get an auth entity by provider and id', function (done) {
      AuthProfile.get('local', userId, function (err, a) {
        should.not.exist(err);
        String(a.userId).should.equal(userId);
        a.profile.provider.should.equal('local');
        a.profile.id.should.equal(userId);
        done();
      });
    });
  });
});
