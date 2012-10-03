'use strict';

/**
 * flash.service spec
 */

describe('flash.services::', function () {
  var flash,
    $rootScope;

  beforeEach(module('flash.services'));

  describe('flash', function () {
    beforeEach(function () {
      inject(function ($injector) {
        flash = $injector.get('flash');
        $rootScope = $injector.get('$rootScope');
      });
      // Add messages
      flash.add('test1');
      flash.add('test2', 'error');
    });

    afterEach(inject(function () {}));

    describe('add()', function () {

      it('should add a flash message', function () {
        // Get them
        var f = flash.all();
        expect(f[0].message).toBe('test1');
        expect(f[0].level).toBe('info');
        expect(f[1].message).toBe('test2');
        expect(f[1].level).toBe('error');
      });

      it('should broadcast "flash.add"', function () {
        // Set it
        var m = 'broadcast this!!';
        // TODO: if there is no broadcast the test will still pass.
        $rootScope.$on('flash.add', function (err, data) {
          expect(data.message).toBe(m);
        });
        flash.add(m);
      });
    });

    describe('clear()', function () {

      it('should remove all flash message', function () {
        var f;
        // Confirm add
        f = flash.all();
        expect(f.length).toBe(2);
        // clear it
        flash.clear();
        f = flash.all();
        expect(f.length).toBe(0);
      });

      it('should broadcast "flash.clear"', function () {
        // TODO: if there is no broadcast the test will still pass.
        $rootScope.$on('flash.clear', function (err, data) {
          expect(data).toBe(true);
        });
        flash.clear();
      });
    });

    describe('getAll()', function () {

      it('should return all message and clear them.', function () {
        var f;
        // Confirm add
        f = flash.getAll();
        expect(f.length).toBe(2);
        // check cleared
        f = flash.all();
        expect(f.length).toBe(0);
      });

      it('should broadcast "flash.clear"', function () {
        // TODO: if there is no broadcast the test will still pass.
        $rootScope.$on('flash.clear', function (err, data) {
          expect(data).toBe(true);
        });
        flash.getAll();
      });
    });

  });
});
