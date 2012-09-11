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
  'session'
])

  .controller('AccountLoginCtrl', [
    '$scope',
    'config',
    'flash',
    '$location',
    'session',

    function ($scope, config, flash, $location, session) {
      // Note: third party authentication is handled by AccountMainCtrl in the
      // account.controllers.main module

      $scope.login = function(user) {
        session.create(user, $scope.session)
          .success(function (data, status) {
            $location.url('/account');
            flash.add('Password updated successfully', 'success');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);