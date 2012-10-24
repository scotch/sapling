'use strict';

var utils = require('../utils');
var request = require('supertest');
var app = require('../..').app;
var should = require('should');


describe('Accounts: API', function () {
  var baseUrl = '/-/api/v1/account/providers';
  describe('GET /-/api/v1/account/providers', function () {
    //it('should return a 401 error if the user is not authenticated', function (done) {
      //request(app).get(baseUrl).set('Accept', 'application/json').expect(401).end(function (err, res) {
        //should.not.exist(err);
        //res.text.should.equal('Unauthorized');
        //done();
      //});
    //});
  });
});
