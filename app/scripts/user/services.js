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
  'config.services',
  'rpc.services',
  'flash'
])

  .factory('user', [
    'config',
    '$location',
    '$http',
    '$rootScope',
    '$route',
    'flash',

    function (config, $location, $http, $rootScope, $route, flash) {

      /**
       * defaultUser
       *
       * @type {Object}
       */
      var defaultUser = {
        // attributes
        id: '',
        displayName: '',

        // methods
        isAuthenticated: function () {
          return this.id != '';
        },

        isAdmin: function() {
          for (var i = 0, l = this.roles.length ; i < l ; i++) {
            if (roles[i] === 'admin') {
              return true;
            }
          }
          return false;
        }
      };

      var usersUrl = config.API_BASE_URL + '/users';

      // The User Object.
      var User = function (value) {
        return angular.copy(value || defaultUser, this);
      };

      var u = new User();


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
      var get = function (userId) {
        return $http.get(usersUrl + '/' + userId)
      };

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
      var create = function (user) {
        return $http.post(usersUrl, user);
      };

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
      var update = function (user) {
        if (!user.id) {
          throw new Error("id required");
        }
        return $http.post(usersUrl + '/' + user.id, user);
      };

      /**
       * Retrieves the requesting user's user object from a remote server.
       *
       * @url `{API_URL}/user/me`
       * @method GET
       * 
       * @return User object - immediately returns a User object.
       * The object is empty, but will be populated once the server returns.
       */
      var current = function () {
        $http.get(usersUrl + '/me')
          .success(function (data, status) {
            angular.extend(u, data);
          })
          .error(function (data, status) {
            // TODO add flash
            // flash.addMulti(data.errors);
          });
        return u;
      };

      var signup = function (email, password, user) {

      };

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
        get: get,
        create: create,
        update: update,
        current: current
      }
    }
  ]);
