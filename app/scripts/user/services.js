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
       * @param user {object} a user object that will be created.
       * Properties:
       *  - email (required)
       *  - password
       *    - new (required)
       *  all other fields are optional
       *  - name
       *    - givenName
       *    - familyName
       *    - middleName
       *
       * @param callback function(err, user) a callback to be called on success
       * or fail. The callback first argument is a list of error objects. E.g.
       * [
       *  {
       *    code: 10,
       *    message: 'Invalid email'
       *  }
       * ]
       * the second argument is the user object returned from the server.
       *
       * A callback function is preferred over a promise here, because of the
       * nature of the function. It is likely that the user will be to waiting
       * on the response, therefore a callback seems more appropriate.
       */
      var create = function (user, callback) {
        $http.post(usersUrl, user)
          .success(function (data, status) {
            callback(null, data);
          })
          .error(function (data, status) {
            // TODO add addMulti
            //flash.addMulti(data.errors, 'error');
            callback(data.errors, null);
          });
      };

      /**
       * Retrieves a user from the remote server.
       *
       * @url `{API_URL}/user/{userId}`
       * @method GET
       *
       * @param userId the id of the use you would like to retrieve.
       * @param callback a callback function to be called on success / fail.
       *  - first param error contains a list of errors if any
       *  - second param user contains the user retrieved user.
       */
      var get = function (userId, callback) {
        $http.get(usersUrl + '/' + userId)
          .success(function (data, status) {
            callback(null, data);
          })
          .error(function (data, status) {
            // TODO add addMulti
            //flash.addMulti(data.errors, 'error');
            callback(data.errors, null);
          });
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
