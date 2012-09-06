/**
 * person.service spec
 */

describe('person.services', function() {
  var person = null;
  beforeEach(module('person.services'));

  describe('New Person', function() {
    beforeEach(inject(function($injector) {
      person = $injector.get('person');
    }));

    afterEach(inject(function() {}));

    describe('new()', function() {

      it('should return empty person object', function() {
        // Get them
        var p = person.new();
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
