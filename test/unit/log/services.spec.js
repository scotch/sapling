'use strict';

/*
 * log.services spec
 */

// TODO write spec clue:
// consoleReporter = jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));
describe('log.services::', function () {
  var $log,
    log,
    consoleReporter;

  beforeEach(module('log.services'));

  describe('log', function () {
    beforeEach(inject(function($injector) {
      $log = $injector.get('$log');
      log = $injector.get('log');
    }));

    afterEach(inject(function () {
    }));

    describe('assert()', function () {

      it('should create a new error', function() {
        log.error('test error');
      });

    });

  });

});
