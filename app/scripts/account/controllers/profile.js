'use strict';

/**
 * account.controllers.profile module provides the AccountProfileCtrl Controller.
 *
 * Edit account profile
 * Used in assets/partials/account/profile.html
 */

angular.module('account.controllers.profile', [
  'config',
  'flash',
  'user'
])

  .controller('AccountProfileCtrl', [
    '$scope',
    'flash',
    'user',

    function ($scope, flash, user) {
      $scope.updateUser = function (u) {
        user.update(u)
          .success(function (data, status) {
            // TODO redirect?
            flash.add('Profile updated successfully', 'success');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);