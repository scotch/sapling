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

    function ($scope, $location, user, flash) {
      $scope.createAccount = function (u) {
        user.create(u)
          .success(function (data, status) {
            flash.add('Account created successfully', 'success');
            $location.url('/account');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);