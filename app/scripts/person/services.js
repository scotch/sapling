'use strict';

// person.service provides a person object.

angular.module('person.services', [
  'config.services',
  'rpc.services'
])

  .factory('person', [
    'config',

    function (config) {
      // The Person Object.
      var defaultPerson = {
        // attributes
        id: '',
        name: {
          givenName: '',
          familyName: ''
        },
        email: '',
        emails: [],
        gender: '',
        image: '',
        kind: '',
        provider: '',
        url: '',
        urls: [],
        tagline: '',

        // methods
        formattedName: function () {
          if (this.name && (this.name.givenName || this.name.familyName)) {
            var a = [];
            a = this.name.givenName ? a.concat(this.name.givenName) : a ;
            a = this.name.familyName ? a.concat(this.name.familyName) : a ;
            if (a.length)
             return a.join(' ');
          }
          return 'Anonymous User';
        },

      };

      // New returns a new Person object
      return {
        new: function (value) {
          return angular.copy(value || defaultPerson, this);
        }
      }
    }
  ]);

