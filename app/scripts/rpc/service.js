'use strict';

// Service that issues RPC requests to the back end

angular.module('rpc.services', [
  'config.services'
])

  .factory('rpc', [
    'config',
    '$http',
    '$rootScope',

    function (config, $http, $rootScope) {
      var randNumber = function () {
        return parseInt(Math.random() * 1000000000, 10);
      };

      return {
        run: function (method, params) {
          $rootScope.$broadcast('rpc.status', 'waiting');

          var p = [];
          if (params) {
            p = [params];
          }

          var obj = {
            Method: method,
            Params: p,
            Id: randNumber()
          };

          return $http.post(config.API_BASE_URL, obj);
        }
      };
    }
  ]);
