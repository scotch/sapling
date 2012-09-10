'use strict';

/**
 * account.controllers.signup module provides the AccountSignupCtrl Controller.
 *
 * Signup user and display error messages
 * Used in assets/partials/account/signup.html
 */

angular.module('account.controllers.signup', [
  'config',
  'flash',
  'user'
])

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
      };
    }
  ]);