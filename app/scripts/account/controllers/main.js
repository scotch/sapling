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
    'user',
    'password',
    '$timeout',
    'account.providers',

    function ($scope, cnfg, user, password, $timeout, providers) {
      // 'rpc.status' is a channel used to broadcast messages. It's defined in rpc/services.js
      $scope.$on('rpc.status', function (e, d) {
        if (d == 'waiting')
          $scope.WaitText = 'Working...';
        else
          $scope.WaitText = false;
      });

      // retrieve the current user
      $scope.User = user.Current();

      // initialize an empty password
      $scope.Password = '';

      // Globals
      $scope.Providers = providers.Providers;

      // Functions
      // Open a popup to authenticate users, and redirect to account page on success
      $scope.Authenticate = function (provider, w, h) {
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
          if (p == cnfg.AUTH_SUCCESS_URL) {
            targetWin.close();
            $scope.User = user.Current();
            $location.path('/account').replace();
          }
          // Authentication failed "normally"
          else if (p == cnfg.AUTH_ERROR_URL) {
            targetWin.close();
            $scope.ErrMsgs.push('An error occured please try again.');
          }
          // Authentication failed, try again in one second
          else {
            $timeout(tick, 1000);
          }
        })();

      };

      $scope.Logout = function (u) {
        user.Logout(u)
          .success(function (data, status) {
            if (data.result.Error)
              if (data.result.Error.Code == 0)
                $scope.ErrMsgs.push(ErrServer);
          })
          .error(function (data, status) {
            $scope.ErrMsgs.push(ErrServer);
          });
      };
    }
  ]);