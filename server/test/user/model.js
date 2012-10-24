'use strict';

var utils = require('../utils');
var should = require('should');
var User = require('../../user/model').User;


var user1 = {
  profile: {
    name: {
      givenName: 'Kyle',
      familyName: 'Finley'
    },
    emails: [
      {
        value: 'test@example.com',
        type: 'home',
        status: 3
      }
    ],
    username: 'kfinley'
  }
};

describe('User: model', function () {
  describe('#create()', function () {
    it('should create a new user', function (done) {
      User.create(user1, function (err, u) {
        should.not.exist(err);
        should.exist(u._id);
        var p = u.getProfile();
        p.name.givenName.should.equal('Kyle');
        p.name.familyName.should.equal('Finley');
        p.username.should.equal('kfinley');
        u.profile.emails[0].value.should.equal('test@example.com');
        u.profile.emails[0].status.should.equal(3);
        u.profile.emails[0].primary.should.equal(true);
        done();
      });
    });
  });
  describe('#findByEmailOrUsername()', function () {
    beforeEach(function (done) {
      User.create(user1, function (err, u) {
        should.not.exist(err);
        done();
      });
    });
    it('should return a user by email address', function (done) {
      User.findByEmailOrUsername('test@example.com', function (err, u) {
        should.not.exist(err);
        u.profile.emails[0].value.should.equal('test@example.com');
        done();
      });
    });
    it('should return a user by username', function (done) {
      User.findByEmailOrUsername('kfinley', function (err, u) {
        should.not.exist(err);
        u.profile.emails[0].value.should.equal('test@example.com');
        done();
      });
    });
    it('should return a null user if the email address is not found', function (done) {
      User.findByEmailOrUsername('notfound@example.com', function (err, u) {
        should.not.exist(u);
        done();
      });
    });
  });
  describe('#addEmail()', function () {
    it('should create a new user', function (done) {
      User.create(user1, function (err, u1) {
        should.not.exist(err);
        u1.addEmail('new@example.com', function (err, vs) {
          User.findByEmailOrUsername('new@example.com', function (err, u2) {
            should.not.exist(err);
            String(u2._id).should.equal(String(u1._id));
            var p = u2.getProfile();
            p.emails[0]._id.should.equal('test@example.com');
            p.emails[0].value.should.equal('test@example.com');
            p.emails[0].status.should.equal(3);
            p.emails[0].primary.should.equal(true);
            p.emails[1]._id.should.equal('new@example.com');
            p.emails[1].value.should.equal('new@example.com');
            p.emails[1].status.should.equal(0);
            p.emails[1].primary.should.equal(false);
            done();
          });
        });
      });
    });
  });
});
