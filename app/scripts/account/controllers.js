'use strict';

// Controllers for user account

// Error messages. Text actually displayed.
var ErrServer = 'A Sever Error occured. Please try again.',
  ErrEmailInUse = 'Email address in use. Try <a href="/login">Logging in</a>',
  ErrInvalidAddress = 'Account not found for email address. Try <a href="/signup">Create Account</a>',
  ErrPasswordLength = 'Password must be between 4 -32 characters';

// Error messages. A wrapper object to map server error messages to the application error messages defined above.
var errors = {
  'email: invalid address'                        : ErrInvalidAddress,
  'password: profile not found for email address' : ErrInvalidAddress,
  'password: invalid password'                    : ErrPasswordLength,
  'email: in use'                                 : ErrEmailInUse
};

// The module for user account controllers
angular.module('account.controllers',
  ['config.services',
    'flash.services',
    'user.services'])

  // Main controller. Others are sub-controllers inheriting from its scope members and methods.
  // Used in assets/index.jade
  .controller('AccountCtrl',
  ['$scope',
    'config',
    'user',
    'password',
    '$timeout',

    function ($scope, cnfg, user, password, $timeout) {
      // 'rpc.status' is a channel used to broadcast messages. It's defined in rpc/services.js
      $scope.$on('rpc.status', function (e, d) {
        if (d == 'waiting')
          $scope.WaitText = 'Working...';
        else
          $scope.WaitText = false;
      });

      // retrieve the current user
      $scope.User = user.Current();

      // initialize an empty password
      $scope.Password = '';

      // Globals
      $scope.Providers = [
        //{name: 'google+',    url: cnfg.AUTH_URL+'/google'}
        //{name: 'facebook',  url: cnfg.AUTH_URL+'/facebook'}
        //{name: 'twitter',   url: cnfg.AUTH_URL+'/twitter'}
        //{name: 'linkedin',  url: cnfg.AUTH_URL+'/linkedin'}
        //{name: 'github',    url: cnfg.AUTH_URL+'/github'}
        {name : 'google', url : cnfg.AUTH_URL + '/appengine_openid?provider=gmail.com'},
        {name : 'yahoo', url : cnfg.AUTH_URL + '/appengine_openid?provider=yahoo.com'},
        {name : 'myspace', url : cnfg.AUTH_URL + '/appengine_openid?provider=myspace.com'},
        {name : 'aol', url : cnfg.AUTH_URL + '/appengine_openid?provider=aol.com'}
      ];

      // Functions
      // Open a popup to authenticate users, and redirect to account page on success
      $scope.Authenticate = function (provider, w, h) {
        // default values for parameters
        w = w || 400;
        h = h || 350;

        var url = provider.url,
          left = (screen.width / 2) - (w / 2),
          top = (screen.height / 2) - (h / 2),
          targetWin = window.open(url, 'authWindow', 'toolbar=no, location=1, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        var checkIt = function() {
          var p = targetWin.location.pathname;

          // Authentication succeeded
          if (p == cnfg.AUTH_SUCCESS_URL) {
            targetWin.close();
            $scope.User = user.Current();
            $location.path('/account').replace();
          }
          // Authentication failed "normally"
          else if (p == cnfg.AUTH_ERROR_URL) {
            targetWin.close();
            $scope.ErrMsgs.push('An error occured please try again.');
          }
          // Authentication failed, try again in one second
          else {
            $timeout(checkIt, 1000);
          }
        };

        checkIt();
      };

      $scope.Logout = function (u) {
        user.Logout(u)
          .success(function (data, status) {
            if (data.result.Error)
              if (data.result.Error.Code == 0)
                $scope.ErrMsgs.push(ErrServer);
          })
          .error(function (data, status) {
            $scope.ErrMsgs.push(ErrServer);
          });
      };
    }
  ])

  // Login user and display error messages
  // Used in assets/partials/account/login.jade
  .controller('AccountLoginCtrl', [
    '$scope',
    '$location',
    'config',
    'user',
    '$timeout',
    'flash',
    'password',

    function ($scope, $location, cnfg, user, $timeout, flash, password) {
      // initialize form errors
      $scope.FormErrors = false;
      $scope.ErrMsgs = [];

      $scope.Login = function(u, pass) {
        password.Login(u.email, pass)
          .success(function (data, status) {
            var r = data.result
            if (data.error) {
              $scope.FormErrors = true;
              $scope.ErrMsgs.push((errors[data.error] || ErrServer));
            }
            else {
              $location.path('/account').replace();
            }
          })
          .error(function (data, status) {
            $scope.ErrMsgs.push(ErrServer);
          });
      }
    }
  ])

  // Signup user and display error messages
  // Used in assets/partials/account/signup.jade
  // Logic is the same than AccountLoginCtrl
  .controller('AccountSignupCtrl', [
    '$scope',
    '$location',
    'user',
    'flash',
    'password',

    function ($scope, $location, user, flash, password) {
      // initialize form errors
      $scope.FormErrors = false;
      $scope.ErrMsgs = [];

      $scope.CreateAccount = function (u, pass) {
        password.Create(u.email, pass, u)
          .success(function (data, status) {
            $scope.User = data.result.Person;
            if (data.error) {
              $scope.FormErrors = true;
              $scope.ErrMsgs.push(errors[data.error] || ErrServer);
            }
            else {
              $location.path('/account').replace();
            }
          })
          .error(function (data, status) {
            $scope.ErrMsgs.push(ErrServer);
          });
      }
    }
  ])

  // TODO: Recover user account
  // Used in assets/partials/account/recovery.jade
  .controller('AccountRecoveryCtrl', [
    '$scope',

    function ($scope) {}
  ])

  // TODO: Overview of user account and user options
  // Used in assets/partials/account/overview.jade
  .controller('AccountOverviewCtrl', [
    '$scope',

    function ($scope) {}

  ])

  // Add/edit password to user account
  // Used in assets/partials/account/password.jade
  .controller('AccountPasswordCtrl', [
    '$scope',
    'user',
    'password',

    function ($scope, user, password) {
      // initialize form errors
      $scope.FormErrors = false;
      $scope.ErrMsgs = [];

      $scope.Password = password.Current();

      $scope.UpdatePassword = function (email, passCurrent, u) {
        password.Update(u.email, u.password.current, u.password.new);
      };
    }
  ])

  // Overview of all connected accounts
  // Used in assets/partials/account/connected.jade
  .controller('AccountConnectedCtrl', [
    '$scope',
    'authProfile',

    function ($scope, ap) {
      $scope.AuthProfiles = ap.All();
    }
  ])

  // Manage emails associated with account
  // Used in assets/partials/account/email.jade
  .controller('AccountEmailCtrl', [
    '$scope',
    'user',

    function ($scope, user) {
      $scope.Emails = user.Emails();
    }
  ])

  // Edit account profile
  // Used in assets/partials/account/profile.jade
  .controller('AccountProfileCtrl', [
    '$scope',
    'user',

    function ($scope, user) {
      // initialize form errors
      $scope.FormErrors = false;
      $scope.ErrMsgs = [];

      $scope.UpdateUser = function (u) {
        user.Update(u)
          .success(function (data, status) {
            r = data.result;
            if (data.error) {
              $scope.FormErrors = true;
              $scope.ErrMsgs.push(errors[data.error] || ErrServer);
            }
          })
          .error(function (data, status) {
            $scope.ErrMsgs.push(ErrServer);
          });
      }
    }
  ]);
