// person.service provides a person object.

angular.module('person.services', [
  'config.services',
  'rpc.services'
])

  .factory('user', [
    'config',
    '$location',
    '$http',
    '$rootScope',
    'rpc',
    'flash',

    function (cnfg, $location, $http, rs, rpc, flash) {
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
        }
      };

      // return

      // New returns a new Person object
      return {
        New: function (value) {
          return angular.copy(value || defaultPerson, this);
        }
      }
    }
  ]);

