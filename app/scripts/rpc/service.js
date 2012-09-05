// Service that issues RPC requests to the back end

angular.module('rpc.services', [
  'config.services'
])

  .factory('rpc', [
    'config',
    '$http',
    '$rootScope',
    '$q',

    function (cnfg, $http, rs, $q) {
      var randNumber = function () {
        return parseInt(Math.random()*1000000000, 10);
      };

      return {
        Run: function (method, params) {
          rs.$broadcast('rpc.status', 'waiting');

          var p = [];
          if (params)
            p = [params];

          var obj = {
            Method: method,
            Params: p,
            Id: randNumber()
          };

          return $http.post(cnfg.API_URL, obj);
        }
      }
    }
  ]);
