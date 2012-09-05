'use strict';

angular.module('ds.services', [
  'config.services',
  'rpc.services'
])

  .factory('user', [
    'config',
    '$rootScope',
    'rpc',

    function (cnfg, $rootScope, rpc) {
      var kinds = {};
      var stores = {};

      return {
        Register: function (kind, useLocal, useServer) {},
        NewKey: function (kind, stringID) {}
      }
    }
  ]);
