'use strict';

var utils = require('../../utils');
var request = require('supertest');
var app = require('../../..').app;
var should = require('should');
var mongoose = require('mongoose');


describe('Password', function () {
  var authUrl = '/-/auth';
  describe('POST /-/auth/password', function () {
    it('create user and redirect to "/login"', function (done) {
      request(app).post(authUrl + '/password').send({
        username: 'test@exampl.com',
        password: 'pass1'
      }).expect(200).end(function (err, res) {
        done();
      });
    });
  });
});
