'use strict';

/**
 * account.controllers.main module provides the AccountMainCtrl Controller.
 *
 * Main controller. Others are sub-controllers inheriting from its scope members and methods.
 * Used in assets/index.html
 */

angular.module('account.controllers.main', [
  'config',
  'flash',
  'user'
])

  .controller('AccountMainCtrl', [
    '$scope',
    'config',
    'flash',
    '$location',
    '$timeout',
    'user',
    'session',
    'account.providers',

    function ($scope, config, flash, $location, $timeout, user, session, providers) {


      // retrieve the current user
      $scope.session = session.current();
      $scope.user = user.current();

      // Globals
      $scope.providers = providers.Providers;

      // Functions
      // Open a popup to authenticate users, and redirect to account page on success
      $scope.authenticate = function (provider, w, h) {
        // default values for parameters
        w = w || 400;
        h = h || 350;

        var url = provider.url,
          left = (screen.width / 2) - (w / 2),
          top = (screen.height / 2) - (h / 2),
          targetWin = window.open(url, 'authWindow', 'toolbar=no, location=1, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        (function tick() {
          var p = targetWin.location.pathname;

          // Authentication succeeded
          if (p === config.AUTH_SUCCESS_REDIRECT_URL) {
            targetWin.close();
            $scope.user = user.current();
            $location.url('/account');
          }
          // Authentication failed "normally"
          else if (p === config.AUTH_ERROR_REDIRECT_URL) {
            targetWin.close();
            $scope.ErrMsgs.push('An error occured please try again.');
          }
          // Authentication failed, try again in one second
          else {
            $timeout(tick, 1000);
          }
        })();

      };

      $scope.logout = function () {
        session.destroy()
          .success(function (data, status) {
            flash.add('You have been logged out successfully', 'success');
          })
          .error(function (data, status) {
            flash.error('An error occurred please try again', 'error');
          });

        // Redirect regardless of error.
        $location.url(config.AUTH_LOGOUT_REDIRECT);
      };

    }
  ]);
