'use strict';

/**
 * account.controllers.password module provides the AccountPasswordCtrl Controller.
 *
 * Add/edit password to user account
 * Used in assets/partials/account/password.html
 */

angular.module('account.controllers.password', [
  'config',
  'flash',
  'user'
])

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
  ]);