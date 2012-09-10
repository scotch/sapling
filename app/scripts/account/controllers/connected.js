'use strict';

/**
 * account.controllers.connected module provides the AccountConnectedCtrl Controller.
 *
 * Overview of all connected accounts
 * Used in assets/partials/account/connected.html
 */

angular.module('account.controllers.connected', [

])

  .controller('AccountConnectedCtrl', [
    '$scope',
    'authProfile',

    function ($scope, ap) {
      $scope.AuthProfiles = ap.All();
    }
  ]);