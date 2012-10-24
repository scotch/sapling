'use strict';

// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
var mailer = require('../../mailer/model');


describe('mailer: models', function () {
  
  describe('#sendOne()', function (done) {

    it('should render the templates correctly', function (done) {
      var locals = {
        email: 'one@example.com',
        subject: 'Test Subject',
        name: 'User Name'
      };

      mailer.sendOne('test', locals, function (err, responseStatus, html, text) {
        should.not.exist(err);
        responseStatus.should.include("OK");
        text.should.include("Hello User Name");
        html.should.include('<h1 style="color: red;">Hello User Name</h1>');
        done();
      });
    });

    it('should render the password reset templates correctly', function (done) {
      var locals = {
        email: 'one@example.com',
        subject: 'Password reset',
        name: 'Forgetful User',
        resetUrl: 'http;//localhost:3000/password_reset/000000000001|afdaevdae353'
      };
      mailer.sendOne('password_reset', locals, function (err, responseStatus, html, text) {
        should.not.exist(err);
        responseStatus.should.include("OK");
        text.should.include("Please follow this link to reset your password " + locals.resetUrl);
        html.should.include("Please follow this link to reset your password <a href=\"" + locals.resetUrl + "\">" + locals.resetUrl + "</a>");
        done();
      });
    });
  });

});
