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
    'flash',
    'user',

    function ($scope, flash, user) {
      $scope.updateUser = function (u) {
        user.update(u)
          .success(function (data, status) {
            flash.add('Password updated successfully', 'success');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);