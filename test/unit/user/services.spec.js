'use strict';

/*
 * user.services spec
 */


describe('user.services::', function () {
  var $httpBackend;
  var config;
  var user;

  beforeEach(module('user.services'));

  beforeEach(function () {

    inject(function ($injector, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      config = $injector.get('config');
      user = $injector.get('user');
    });

  });

  afterEach(inject(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  describe('get()', function () {

    it('should return a user if the user exists', function () {
      var url = config.API_BASE_URL + '/users/1';
      var resp = {
        id: '1',
        email: 'kyle@example.com',
        password: {
          current: '',
          new: '',
          isSet: true
        },
        name: {
          givenName: 'Kyle'
        }
      };

      $httpBackend.expectGET(url).respond(resp);

      var p = user.get('1');
      p.success(function (u, status) {
        expect(u.id).toBe('1');
        expect(u.name.givenName).toBe('Kyle');
      });
      p.error(function (data, status) {
        expect(data).toBe(null);
      });

      $httpBackend.flush();
    });

    it('should return an an error is not found', function () {
      var url = config.API_BASE_URL + '/users/2';
      var resp = {
        errors: [
          {
            message: 'User not found',
            code: 404
          }
        ]
      };

      $httpBackend.expectGET(url).respond(404, resp);

      var p = user.get('2');
      p.success(function (u, status) {
        expect(u).toBe(null);
      });
      p.error(function (data, status) {
        expect(status).toBe(404);
        expect(data.errors[0].code).toBe(404);
      });

      $httpBackend.flush();
    });

  });

  describe('create()', function () {

    it('should successfully create a user if valid', function () {
      var url = config.API_BASE_URL + '/users';
      var payload = {
        email: 'kyle@example.com',
        password: {
          current: '',
          new: 'secret'
        },
        name: {
          givenName: 'Kyle',
          familyName: 'Finley',
          middleName: '\"Danger\"'
        },
        urls: [
          {
            'value': 'http://kylefinley.com',
            'type': 'home'
          },
          {
            'value': 'http://scotchmedia.com',
            'type': 'work'
          }
        ]
      };
      var resp = {
        id: '1',        // NOTICE: an id was added
        email: 'kyle@example.com',
        password: {
          current: '',  // NOTICE: current was cleared
          new: '',      // NOTICE: new was cleared
          isSet: true   // NOTICE: isSet was returned
        },
        name: {
          givenName: 'Kyle',
          familyName: 'Finley',
          middleName: '\"Danger\"'
        },
        urls: [
          {
            'value': 'http://kylefinley.com',
            'type': 'home'
          },
          {
            'value': 'http://scotchmedia.com',
            'type': 'work'
          }
        ]
      };

      $httpBackend.expectPOST(url, payload).respond(resp);

      var p = user.create(payload);
      p.success(function (u, status) {
        expect(status).toBe(200);
        expect(u.id).toBe('1');
        expect(u.password.isSet).toBe(true);
      });
      p.error(function (data, status) {
        expect(data).toBe(null);
      });

      $httpBackend.flush();

    });

    it('should return an error if in-valid', function () {
      var url = config.API_BASE_URL + '/users';
      var payload = {
        email: 'kyle@example.com',
        password: {
          current: '',
          new: ''
        },
      };
      var resp = {
        errors: [
          {
            message: 'Invalid password',
            code: 11
          }
        ]
      };

      $httpBackend.expectPOST(url, payload).respond(400, resp);

      user.create(payload, function (err, u) {
        expect(err[0].code).toBe(11);
        expect(u).toBe(null);
      });

      $httpBackend.flush();

      payload = {
        email: 'fake',
        password: {
          current: '',
          new: ''
        }
      };
      resp = {
        errors: [
          {
            message: 'Invalid email',
            code: 10
          },
          {
            message: 'Invalid password',
            code: 11
          }
        ]
      };

      $httpBackend.expectPOST(url, payload).respond(400, resp);

      var p = user.create(payload);
      p.success(function (u, status) {
        expect(u).toBe(null);
      });
      p.error(function (data, status) {
        expect(status).toBe(400);
        expect(data.errors[0].code).toBe(10);
        expect(data.errors[1].code).toBe(11);
      });

      $httpBackend.flush();
    });

  });

  describe('update()', function () {

    it('should successfully update a user if valid', function () {
      var url = config.API_BASE_URL + '/users/1';
      var payload = {
        id: '1',
        email: 'changed@example.com',
        name: {
          givenName: 'Kyle'
        }
      };

      $httpBackend.expectPUT(url, payload).respond(payload);

      var p = user.update(payload);
      p.success(function (u, status) {
        expect(status).toBe(200);
        expect(u.id).toBe('1');
      });
      p.error(function (data, status) {
        expect(data).toBe(null);
      });

      $httpBackend.flush();

    });

    it('should return an error if the user does not have and id', function () {
      var url = config.API_BASE_URL + '/users/1';

      // TODO how is this tested?
      var payload = {
        name: {
          givenName: 'Kyle'
        }
      };

      // TODO figure out how to test this. Or better yet find a better way to
      // handle errors..
      // expect(user.update(payload)).toThrow(new Error("id required"));
      // $httpBackend.flush();
    });

  });

  describe('current()', function () {

    it('should return a user object if the user has an account', function () {
      var url = config.API_BASE_URL + '/users/me';
      var resp = {
        id: '1',
        email: 'kyle@example.com',
        password: {
          current: '',
          new: '',
          isSet: true
        },
        name: {
          givenName: 'Kyle'
        }
      };

      $httpBackend.expectGET(url).respond(resp);

      var u = user.current();
      $httpBackend.flush();

      expect(u.id).toBe('1');
      expect(u.name.givenName).toBe('Kyle');

    });

    it('should return an error if the user does not have and account', function () {
      // TODO should this be broadcast as a flash message?
      // TODO the user really doesn't need to know about this, do they?
      var url = config.API_BASE_URL + '/users/me';
      var resp = {};

      $httpBackend.expectGET(url).respond(404, resp);

      var u = user.current();
      $httpBackend.flush();

      // TODO check something here.

    });
  });

});
