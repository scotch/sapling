'use strict';

// userProfile.service provides a userProfile object.

angular.module('userProfile.services', [
  'config.services',
  'rpc.services'
])

  .factory('userProfile', [
    'config',

    function (config) {
      // The userProfile Object.
      var defaultUserProfile = {
        // attributes
        id: '',
        name: {
          givenName: '',
          familyName: ''
        },
        email: '',
        emails: [],
        birthday: '',
        gender: '',
        image: '',
        kind: '',
        provider: '',
        url: '',
        urls: [],
        utcOffset: '',

        // methods
        displayName: function () {
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

      // New returns a new userProfile object
      return {
        new: function (value) {
          return angular.copy(value || defaultUserProfile, this);
        }
      }
    }
  ]);

