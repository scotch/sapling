'use strict';

/*
 * log.services spec
 */

describe('log.services::', function () {
  var $log,
    log,
    consoleReporter,
    ds;

  beforeEach(module('log.services'));

  describe('log', function () {
    beforeEach(inject(function($injector) {
      $log = $injector.get('$log');
      log = $injector.get('log');
      consoleReporter = jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));
    }));

    afterEach(inject(function () {
    }));

    describe('assert()', function () {

      it('should create a new error', function() {

        log.error('test error');
        expect(consoleReporter).toBe('test error');
      });

    });

  });

});
