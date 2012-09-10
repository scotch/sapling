'use strict';

/**
 * account.controllers.recovery module provides the AccountRecoveryCtrl Controller.
 *
 * Add/edit password to user account
 * Used in assets/partials/account/recovery.html
 */

// TODO: Recover user account
angular.module('account.controllers.recovery', [
  'config',
  'flash',
  'user'
])

  .controller('AccountRecoveryCtrl', [
    '$scope',

    function ($scope) {}
  ]);