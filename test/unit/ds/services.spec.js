'use strict';

/*
 * ds.services spec
 */

describe('ds::', function () {
  var $httpBackend,
    config,
    ds;

  beforeEach(module('ds.services'));

  describe('ds.services', function () {
    beforeEach(inject(function ($injector) {
      config = $injector.get('config');
      $httpBackend = $injector.get('$httpBackend');
      ds = $injector.get('ds');
    }));

    afterEach(inject(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));

    describe('get()', function () {

      it('should populate an object with data from the server', function () {

        var url = config.API_BASE_URL + '/users/1';
        var entityGroup = 'user';
        var key = '1';

        var obj = {
          // test attributes
          name: 'obj',
          // test methods
          printName: function () {
            return this.name;
          }
        };

        var resp = {
          serverValue: 'added by the server'
        };

        $httpBackend.expectGET(url).respond(resp);

        var p = ds.get(entityGroup, key, obj);

        p.success(function (obj, status) {
          expect(status).toBe(200);
          expect(obj.serverValue).toBe('added by the server');
        });
        p.error(function (data, status) {
          expect(data).toBe(null);
        });

        $httpBackend.flush();

        expect(obj.name).toBe('obj');
        expect(obj.printName()).toBe('obj');
        expect(obj.serverValue).toBe('added by the server');

      });

    });

  });

});
