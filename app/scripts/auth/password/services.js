// Password manager service

angular.module('auth.password.services', [
  'rpc.services'
])

  .factory('password', [
    'rpc',

    function (rpc) {
      var defaultPassword = {
        email: '',
        new: '',
        current: '',
        isSet: ''
      };

      var Password = function (value) {
          angular.copy(value || defaultPassword, this);
      };

      p = new Password();

      return {
        Current: function () {
          rpc.Run('Password.Current', null)
            .success( function (data, status) {
              if (data.error) {
                flash.Add(data.error);
              }
              angular.extend(p, data.result.Password);
            })
            .error(function (data, status) {});

          return p;
        },

        Login: function (email, pass) {
          var obj = {
            password: {
              current: pass,
              email: email
            },
            person: {
              email: email
            }
          };
          rpc.Run('Password.Authenticate', obj);
        },

        Create: function (email, pass, person) {
          var obj = {
            password: {
              new: pass,
              email: email
            },
            person: person
          };
          rpc.Run('Password.Authenticate', obj);
        },

        Update: function (email, currentPass, newPass, person) {
          var obj = {
            password: {
              current: currentPassword,
              new: newPassword,
              email: email
            },
            person: person
          };
          rpc.Run('Password.Authenticate', obj);
        }
      }
    }
  ]);
