'use strict';

/**
 * user.services provides services for interacting with user.
 * This service serves as a convenient wrapper for other user related services.
 */
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
    'rpc',
    'flash',

    function (config, $location, $http, $rootScope, $route, rpc, flash) {
      /******
       * User
       *****/

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

      /******
       * Email
       *****/

      // The Email Object.
      var defaultEmail = {
        address: '',
        status: '',
        created: '',
        updated: ''
      };

      var u = new User();

      /**
       * Code taken from https://groups.google.com/forum/?fromgroups=#!starred/angular/POXLTi_JUgg
       * By Adam Wynne
       */
      $rootScope.$on("$routeChangeSuccess", function (current) {
        var authRequired = $route.current && $route.current.$route && $route.current.$route.auth;
        if (authRequired && !u.isAuthenticated()) {
          //growl.info("Authentication error", "You need to be signed in to view that page.<br/><br/>" + "Please sign in and we'll have you viewing that page in a jiffy");
          var currentUrl = $location.url();
          var redirectUrl = config.AUTH_LOGIN_REDIRECT_URL + '?next=' + encodeURIComponent(currentUrl);
          $location.url(redirectUrl)
        }
      });

      var emails = [];

      var statusCode = {
        0: 'unverified',
        1: 'pending',
        2: 'verified',
        3: 'primary'
      };

      var status = function (code) {
          return statusCode[code];
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


      var current = function (callback) {
        if (!u.id) {
          rpc.Run('User.Current', null)
            .success(function (data, status) {
              if (data.error)
                flash.Add(data.error);
              else
                angular.extend(u, data.result.Person);
            })
            .error(function (data, status) {});
        }
        return u;
      };
//
//      logout: function (user) {
//        var obj = {
//          Person: user
//        };
//        u = defaultUser;
//        rpc.Run('User.Logout', obj);
//      },
//
//      update = function (user) {
//        if (!user.id)
//          throw new Error("The user doesn't have an id");
//        var obj = {
//          Person: user
//        };
//        rpc.Run('User.Update', obj);
//      }
//
//      emails = function () {
//        rpc.Run('User.Emails', null)
//          .success(function (data, status) {
//            if (data.error)
//              flash.Add(data.error);
//            if (data.result.emails)
//              angular.extend(emails, data.result.emails);
//          })
//          .error(function (data, status) {});
//        return emails;
//      }
      return {
        create: create,
        get: get
      }
    }
  ]);
