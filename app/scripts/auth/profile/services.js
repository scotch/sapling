// Service related to user profile
// Send RPC requests

angular.module('auth.profile.services', [
  'rpc.services'
])

  .factory('authProfile', [
    'rpc',

    function (rpc) {
      // The AuthProfile Object.
      var defaultAuthProfile = {
        // attributes
        id: '',
        name: {
          givenName: '',
          familyName: ''
        },
        provider: '',
        url: '',
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
          return 'admin' in this.roles; // TODO: Convert this in a clear way
        }
      };

      var profiles = [];

      return {
        All : function() {
          rpc.Run('AuthProfile.GetAll', null)
            .success(function (data, status) {
              if (data.error) {
                flash.Add(data.error);
              }
              if (data.result.Profiles) {
                angular.extend(profiles, data.result.Profiles);
              }
            })
            .error(function (data, status) {});
          return profiles;
        },
        GetAll : function() {
          rpc.Run('AuthProfile.GetAll', null)
            .success(function (data, status) {
              if (data.error) {
                flash.Add(data.error);
              }
              else {
                angular.extend(u, data.result.Person);
              }
            })
            .error(function (data, status) {});
        }
      }
    }
]);
