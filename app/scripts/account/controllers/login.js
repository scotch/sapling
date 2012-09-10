'use strict';

/**
 * account.controllers.login module provides the AccountLoginCtrl Controller.
 *
 * Login user and display error messages
 * Used in assets/partials/account/login.html
 */

angular.module('account.controllers.login', [
  'config',
  'flash',
  'user'
])

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
            var r = data.result;
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
  ]);