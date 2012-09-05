'use strict';

// Service to broadcast messages to all scopes, since the $broadcast call is made from the $rootScope
var serv = {};

serv.flash = [
  'config',
  '$rootScope',

  function (cnfg, $rootScope) {
    var flashes = [];

    return {
      Flashes: flashes,

      Add: function (message, level) {
        // default value for the level parameter
        level = level || 'info';

        var flash = {
          Message: message,
          Level: level
        };
        flashes.push(flash);

        // tell child scope that this flash has been added
        $rootScope.$broadcast('flash.add', flash);
      },

      Get: function () {
        angular.copy(flashes);
        flashes = [];
      },

      Clear: function () {
        flashes = []
      },

      Pop: function (position) {
        $rootScope.$broadcast('flash.remove');
      }
    }
  }
];

angular.module('flash.services', [
  'config.services'
]).factory(serv);
