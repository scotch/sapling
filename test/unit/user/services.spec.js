/*
 * user.services spec
 */

describe('user.services::', function() {
  var $httpBackend
    , config
    , user;

  beforeEach(module('user.services'));

  describe('User:', function() {
    beforeEach(inject(function($injector) {
      config = $injector.get('config');
      $httpBackend = $injector.get('$httpBackend');
      user = $injector.get('user');
    }));

    afterEach(inject(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));

    describe('Create User', function() {

      it('should successfully create a user if valid', function() {
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

        user.create(payload, function (err, u) {
          expect(u.id).toBe('1');
          expect(u.password.isSet).toBe(true);
        });

        $httpBackend.flush();
      });

      it('should return an error if in-valid', function() {
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

        user.create(payload, function (err, u) {
          // TODO this test is fragile. Find a better way.
          expect(err[0].code).toBe(10);
          expect(err[1].code).toBe(11);
          expect(u).toBe(null);
        });

        $httpBackend.flush();
      });

    });

    describe('Get User', function() {

      it('should return a user if the use exists', function() {
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

        user.get('1', function (err, u) {
          expect(u.id).toBe('1');
          expect(u.name.givenName).toBe('Kyle');
        });

        $httpBackend.flush();
      });

      it('should return an an error is not found', function() {
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

        user.get('2', function (err, u) {
          expect(err[0].code).toBe(404);
          expect(u).toBe(null);
        });

        $httpBackend.flush();
      });

    });
  });
//  describe('Password:', function() {
//    beforeEach(inject(function($injector) {
//      config = $injector.get('config');
//      $httpBackend = $injector.get('$httpBackend');
//      password = $injector.get('user.password');
//      apiUrl = config.API_BASE_URL;
//    }));
//
//    afterEach(inject(function() {
//      $httpBackend.verifyNoOutstandingExpectation();
//      $httpBackend.verifyNoOutstandingRequest();
//    }));
//
//    describe('Checking status', function() {
//      var url = apiUrl + '/auth/password';
//
//      it('should return false if the password has not been set', function() {
//        var resp = {
//          isSet: false
//        };
//        $httpBackend.expectGET(url).respond(resp);
//        var p = password.Status();
//        $httpBackend.flush();
//        expect(p.isSet).toBe(false);
//      });
//
//      it('should return true if the password has been set', function() {
//        var resp = {
//          isSet: false
//        };
//        $httpBackend.expectGET(url).respond(resp);
//        var p = password.Status();
//        $httpBackend.flush();
//        expect(p.isSet).toBe(true);
//      });
//    });
//
//    describe('When creating a password', function() {
//      var url = apiUrl + '/auth/password';
//
//      describe('a new User', function() {
//
//        it('should succeed when credentials are valid', function() {
//          var username = 'kyle';
//          var pass = 'secret';
//          var payload = {
//            username: username,
//            password: pass
//          };
//          var resp = {
//            isSet: true
//          };
//          $httpBackend.expectPOST(url, payload).respond(resp);
//          var p = password.Create(username, password);
//          $httpBackend.flush();
//          expect(p.isSet).toBe(false);
//        });
//
//        it('should receive a 400 Bad request error when invalid', function() {
//          var username = '';
//          var pass = '';
//          var payload = {
//            username: username,
//            password: pass
//          };
//          var resp = {
//            isSet: false
//          };
//          $httpBackend.expectPOST(url, payload).respond(400, "Bad request");
//          var p = password.Create(username, password);
//          $httpBackend.flush();
//          expect(p.isSet).toBe(false);
//        });
//      });
//    });
//  });
});
