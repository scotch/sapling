// user.services provides services for interating with users

angular.module('user.services', [
  'config.services',
  'rpc.services'
])

  .factory('user', [
    'config',
    '$location',
    '$http',
    '$rootScope',
    '$route',
    'rpc',
    'flash',

    function (cnfg, $location, $http, $rootScope, $route, rpc, flash) {
      /******
       * User
       *****/

      // The User object.
      var defaultUser = {
        // attributes
        id: '',
        name: {
          givenName: '',
          familyName: ''
        },
        email: '',
        emails: [],
        roles: [],

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

        isAuthenticated: function() {
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
        authRequired = $route.current && $route.current.$route && $route.current.$route.auth;
        if (authRequired && !u.isAuthenticated()) {
          //growl.info("Authentication error", "You need to be signed in to view that page.<br/><br/>" + "Please sign in and we'll have you viewing that page in a jiffy");
          var currentUrl = $location.url();
          var redirectUrl = cnfg.AUTH_LOGIN_URL + '?next=' + encodeURIComponent(currentUrl);
          //$location.url(redirectUrl)
        }
      });

      var emails = [];

      var status = {
        0: 'unverified',
        1: 'pending',
        2: 'verified',
        3: 'primary'
      };

      return {
        Status : function (code) {
          return status[code];
        },

        Current: function () {
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
        },

        Logout: function (user) {
          var obj = {
            Person: user
          };
          u = defaultUser;
          rpc.Run('User.Logout', obj);
        },

        Update: function (user) {
          if (!user.id)
            throw new Error("The user doesn't have an id");
          var obj = {
            Person: user
          };
          rpc.Run('User.Update', obj);
        },

        Emails: function () {
          rpc.Run('User.Emails', null)
            .success(function (data, status) {
              if (data.error)
                flash.Add(data.error);
              if (data.result.emails)
                angular.extend(emails, data.result.emails);
            })
            .error(function (data, status) {});
          return emails;
        }
      }
    }
  ]);
