'use strict';

var utils = require('../utils');
var request = require('supertest');
var app = require('../..').app;
var should = require('should');


describe('User: api', function () {
  var baseUrl = '/-/api/v1/users';
  var user1 = {
    id: '',
    name: {
      givenName: 'Micheal',
      middleName: '"Danger"',
      familyName: 'Scorn'
    },
    emails: {
      value: 'scorn@example.com'
    },
    username: 'agentscorn'
  };
  describe('POST /-/api/v1/users', function () {
    it('should create a new user if request is valid', function (done) {
      request(app).post(baseUrl).send(user1).set('Accept', 'application/json').expect(201).end(function (err, res) {
        var u = JSON.parse(res.text);
        should.not.exist(err);
        should.exist(u.id);
        u.name.givenName.should.equal('Micheal');
        u.name.middleName.should.equal('"Danger"');
        u.name.familyName.should.equal('Scorn');
        u.username.should.equal('agentscorn');
        done();
      });
    });
  });
  describe('GET /-/api/v1/users', function () {
    var userId = void 0;
    beforeEach(function (done) {
      request(app).post(baseUrl).send(user1).expect(201).end(function (err, res) {
        var u = JSON.parse(res.text);
        userId = u.id;
        should.not.exist(err);
        done();
      });
    });
    it('should return a new user if it exists', function (done) {
      request(app).get(baseUrl + '/' + userId).expect(200).end(function (err, res) {
        var u = JSON.parse(res.text);
        should.not.exist(err);
        u.name.givenName.should.equal('Micheal');
        u.name.middleName.should.equal('"Danger"');
        u.name.familyName.should.equal('Scorn');
        u.username.should.equal('agentscorn');
        done();
      });
    });
  });
});
