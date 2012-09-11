'use strict';

// Define the application level controllers
angular.module('app.controllers', [])
  // the AppCtrl is used in index.html (see app/assets/index.html)
  .controller('AppCtrl', [
    '$scope',
    '$location',

    function ($scope, $location) {

      // TODO moved these to directives

      // 'rpc.status' is a channel used to broadcast messages. It's defined in rpc/services.js
      $scope.$on('rpc.status', function (e, d) {
        if (d === 'waiting')
          $scope.WaitText = 'Working...';
        else
          $scope.WaitText = false;
      });

      // Uses the url to determine if the selected
      // menu item should have the class active.
      $scope.$location = $location;
      $scope.$watch('$location.path()', function (path) {
          $scope.activeNavId = path || '/';
        }
      );

      // getClass compares the current url with the id.
      // If the current url starts with the id it returns 'active'
      // otherwise it will return '' an empty string. E.g.
      //
      //   # current url = '/products/1'
      //  getClass('/products') # returns 'active'
      //  getClass('/orders') # returns ''
      $scope.getClass = function (id) {
        if($scope.activeNavId.substring(0, id.length) == id)
          return 'active';
        else
          return '';
      }
    }
  ])

  // Just placeholders controllers. To be filled with your own logic.
  .controller('MyCtrl1', [
    '$scope',
    function ($scope) {
      return $scope;
    }
  ])

  .controller('MyCtrl2', [
    '$scope',
    function ($scope) {
      return $scope;
    }
  ]);