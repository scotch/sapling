'use strict';

var utils = require('../../utils');
var should = require('should');
var Password = require('../../../auth/password/model').Password;


describe('Password', function () {
  var userId = '000000000000000000000001';

  describe('#new()', function () {
    it('should create a new password entity when the info is vaild', function (done) {
      Password["new"](userId, 'pass1', function (err, p) {
        should.not.exist(err);
        should.exist(p._id);
        should.exist(p.createdAt);
        should.exist(p.auth.passwordHash);
        String(p.userId).should.equal(userId);
        p.provider.name.should.equal('local');
        Password.findOne({
          userId: userId
        }, function (err, u) {
          String(p.userId).should.equal(userId);
          done();
        });
      });
    });
    it('should return an error when the password is to short', function (done) {
      Password["new"](userId, 'pas', function (err, p) {
        should.exist(err);
        err.code.should.equal(12);
        err.message.should.equal('invalid password length');
        should.not.exist(p);
        done();
      });
    });
    it('should return an error if the user has already created a password', function (done) {
      Password["new"](userId, 'pass1', function (err, p) {
        should.not.exist(err);
        Password["new"](userId, 'pass1', function (err, p) {
          err.code.should.equal(11000);
          should.exist(err);
          done();
        });
      });
    });
  });
  describe('#authenticate()', function () {
    var pass = 'pass1';
    beforeEach(function (done) {
      Password["new"](userId, pass, function (err, p) {
        done();
      });
    });
    it('should return true when password is vaild', function (done) {
      Password.authenticate(userId, pass, function (err, valid) {
        should.not.exist(err);
        valid.should.equal(true);
        done();
      });
    });
    it('should return false when password is invaild', function (done) {
      Password.authenticate(userId, 'fake', function (err, valid) {
        should.not.exist(err);
        valid.should.equal(false);
        done();
      });
    });
  });
});
