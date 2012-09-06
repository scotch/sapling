/**
 * userProfile.service spec
 */

describe('userProfile.services', function() {
  var userProfile = null;
  beforeEach(module('userProfile.services'));

  describe('New userProfile', function() {
    beforeEach(inject(function($injector) {
      userProfile = $injector.get('userProfile');
    }));

    afterEach(inject(function() {}));

    describe('new()', function() {

      it('should return empty userProfile object', function() {
        // Get them
        var p = userProfile.new();
        expect(p.name.givenName).toBe('');
        expect(p.name.familyName).toBe('');
        // Before name is set
        expect(p.formattedName()).toBe('Anonymous User');
        // Set the name
        p.name.givenName = 'Ron';
        p.name.familyName = 'Paul';
        expect(p.formattedName()).toBe('Ron Paul');
      });
    });

  });
});
