'use strict';

/**
 * account.controllers.connected module provides the AccountEmailCtrl Controller.
 *
 * Manage emails associated with account
 * Used in assets/partials/account/email.html
 */

angular.module('account.controllers.email', [
  'config',
  'flash',
  'user'
])

  .controller('AccountEmailCtrl', [
    '$scope',
    'user',

    function ($scope, user) {
      $scope.emails = user.emails();
    }
  ]);