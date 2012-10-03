'use strict';

/**
 * userProfile.service provides a userProfile object.
 * You generally will *not* uses the userProfile directly, but instead reference
 * it through other services. E.g. `user` `auth`
 */
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
          honorificPrefix: '',
          givenName: '',
          middleName: '',
          familyName: '',
          honorificSuffix: '',
          formatted: '' // TODO change display name into a function so we can use it here.
        },
        email: '',
        emails: [],
        birthday: '',
        gender: '',
        image: '',
        roles: [],
        kind: '',
        provider: '',
        url: '',
        urls: [],
        utcOffset: '',

        // methods
        displayName: function () {
          if (this.name && (this.name.givenName || this.name.familyName)) {
            var a = [];
            a = this.name.givenName ? a.concat(this.name.givenName) : a;
            a = this.name.familyName ? a.concat(this.name.familyName) : a;
            if (a.length) {
              return a.join(' ');
            }
          }
          return 'Anonymous User';
        },
        isAuthenticated: function () {
          return this.id !== '';
        },
        isAdmin: function () {
          for (var i = 0, l = this.roles.length ; i < l ; i++) {
            if (roles[i] === 'admin') {
              return true;
            }
          }
          return false;
        }
      };

      // New returns a new userProfile object
      return {
        /**
         * new creates a new UserProfile.
         * @param value
         * @return {object} a UserProfile object
         */
        new: function (value) {
          return angular.copy(value || defaultUserProfile, this);
        }
      }
    }
  ]);

