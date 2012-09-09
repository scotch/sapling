'use strict';

/**
 * user.services provides services for interacting with user.
 * This service serves as a convenient wrapper for other user related services.
 */

// TODO angular.extend the objects that are passed in with the result from the server.
// E.g.
//  var u = {'name': {'givenName': 'Kyle'}};
//  user.create(u);
//  // after return form sever
//  u.id // '1' populated from the server
angular.module('user.services', [
  'config',
  'log',
  'ds',
  'flash'
])

  .factory('user', [
    'config',
    'log',
    'ds',
    '$location',
    '$rootScope',
    '$route',
    'flash',

    function (config, log, ds, $location, $rootScope, $route, flash) {

      /**
       * defaultUser
       *
       * @type {Object}
       */
      var defaultUser = {
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
            a = this.name.givenName ? a.concat(this.name.givenName) : a ;
            a = this.name.familyName ? a.concat(this.name.familyName) : a ;
            if (a.length)
              return a.join(' ');
          }
          return 'Anonymous User';
        },

        isAuthenticated: function () {
          return this.id !== '';
        },

        isAdmin: function () {
          for (var i = 0, l = this.roles.length ; i < l ; i++) {
            if (this.roles[i] === 'admin') {
              return true;
            }
          }
          return false;
        }
      };

      /**
       * User object
       *
       * @param value existing vales you would like to merge.
       * @return a new User object
       */
      // TODO can the value param be removed?
      function User(value) {
        return angular.copy(value || defaultUser, this);
      }

      var currentUser = new User();

      /**
       * Retrieves a user from the remote server.
       *
       * @url `{API_URL}/user/{userId}`
       * @method GET
       *
       * @param userId the id of the user you would like to retrieve.
       *
       *  @return $http promise
       */
      function get(userId, user) {
        return ds.get('user', userId, user);
      }

      /**
       * Creates a user on the remote server.
       *
       * @url `{API_URL}/user`
       * @method POST
       * @payload {object} User
       *
       * @param user {object} a User object that will be created.
       * Properties:
       *  - email (required)
       *  - password
       *    - new (required)
       *  All other properties are optional
       *  - name
       *    - givenName
       *    - familyName
       *    - middleName
       *
       *  @return $http promise
       *  If an error occurs the promises error function will receive a list of
       *  errors E.g.
       *  [
       *    {
       *      code: 10,
       *      message: 'Invalid email'
       *    }
       *  ]
       */
      function create(user) {
        return ds.create('User', user);
      }

      /**
       * Update updates an existing User with a remote server.
       *
       * @url `{API_URL}/user/{user.id}`
       * @method POST
       * @payload {object} User
       *
       * @param user {object} the User object that will be updated.
       *
       *  @return $http promise
       *  If an error occurs the promises error function will receive a list of
       *  errors E.g.
       *  [
       *    {
       *      code: 10,
       *      message: 'Invalid email'
       *    }
       *  ]
       */
      function update(user) {
        log.assert(user.id, 'user: id is required to preform an update');
        return ds.update('User', user.id, user);
      }

      /**
       * Retrieves the requesting user's user object from a remote server.
       *
       * @url `{API_URL}/user/me`
       * @method GET
       * 
       * @return User object - immediately returns a User object.
       * The object is empty, but will be populated once the server returns.
       */
      function current() {
        ds.get('User', 'me', currentUser);
        return currentUser;
      }


      /**
       * Code taken from https://groups.google.com/forum/?fromgroups=#!starred/angular/POXLTi_JUgg
       * By Adam Wynne
       *
       * TODO find a better place for this. Session?
       */
      $rootScope.$on("$routeChangeSuccess", function (current) {
        var authRequired = $route.current && $route.current.$route && $route.current.$route.auth;
        if (authRequired && !u.isAuthenticated()) {
          // TODO add flash message
          var currentUrl = $location.url();
          var redirectUrl = config.AUTH_LOGIN_REDIRECT_URL + '?next=' + encodeURIComponent(currentUrl);
          $location.url(redirectUrl)
        }
      });

      return {
        User: User,
        get: get,
        create: create,
        update: update,
        current: current
      };
    }
  ]);
