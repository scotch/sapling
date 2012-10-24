'use strict';

var utils = require('../../utils');
var request = require('supertest');
var app = require('../../..').app;
var should = require('should');


describe('Password: API', function () {
  var baseUrl = '/-/api/v1/auth/password';
  describe('GET /-/api/v1/auth/password', function () {
    it('should a 401 error if the user is not authenticated', function (done) {
      request(app).get(baseUrl).set('Accept', 'application/json').expect(401).end(function (err, res) {
        should.not.exist(err);
        res.text.should.equal('Unauthorized');
        done();
      });
    });
  });
  describe('POST /-/api/v1/auth/password', function () {
    it('should a 400 error if password is empty', function (done) {
      var obj1 = {
        password: '',
        user: {
          name: {
            givenName: 'Micheal',
            familyName: 'Scorn'
          },
          email: 'scorn@example.com',
          username: 'agentscorn'
        }
      };
      request(app).post(baseUrl).send(obj1).set('Accept', 'application/json').expect(400).end(function (err, res) {
        should.not.exist(err);
        var r = JSON.parse(res.text);
        r.code.should.equal(12);
        r.message.should.equal('invalid password length');
        done();
      });
    });
    it('should create a new user and a 201 if valid', function (done) {
      var obj1 = {
        password: 'pass1',
        user: {
          id: '',
          name: {
            givenName: 'Micheal',
            familyName: 'Scorn'
          },
          email: 'SCORN@example.com'
        }
      };
      request(app).post(baseUrl).send(obj1).set('Accept', 'application/json').expect(201).end(function (err, res) {
        should.not.exist(err);
        var u = JSON.parse(res.text);
        should.exist(u.id);
        u.name.givenName.should.equal('Micheal');
        u.name.familyName.should.equal('Scorn');
        u.emails[0].value.should.equal('scorn@example.com');
        done();
      });
    });
  });
});
