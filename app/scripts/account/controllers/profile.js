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
    'user',

    function ($scope, user) {
      // initialize form errors
      $scope.FormErrors = false;
      $scope.ErrMsgs = [];

      $scope.UpdateUser = function (u) {
        user.Update(u)
          .success(function (data, status) {
            var r = data.result;
            if (data.error) {
              $scope.FormErrors = true;
              $scope.ErrMsgs.push(errors[data.error] || ErrServer);
            }
          })
          .error(function (data, status) {
            $scope.ErrMsgs.push(ErrServer);
          });
      }
    }
  ]);