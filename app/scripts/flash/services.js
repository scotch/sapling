'use strict';

// Service to broadcast messages to all scopes, since the $broadcast call is made from the $rootScope
var serv = {};

serv.flash = [
  'config',
  '$rootScope',

  function (cnfg, $rootScope) {
    var flashes = [];

    return {

      /**
       * add adds a single flash message.
       *
       * @param message
       *  A string representing the flash message
       * @param level
       *  the classification of the flash options are:
       *  - 'info' // the default
       *  - 'success'
       *  - 'error'
       */
      add: function (message, level) {
        // default value for the level parameter
        level = level || 'info';

        var flash = {
          message: message,
          level: level
        };
        flashes.push(flash);

        // tell child scope that this flash has been added
        $rootScope.$broadcast('flash.add', flash);
      },

      /**
       * all returns all flashes, but does **not** clear them
       * @return {Array}
       */
      all: function () {
        return flashes;
      },

      /**
       * clear removes all flashes
       */
      clear: function () {
        $rootScope.$broadcast('flash.clear', true);
        flashes = [];
      },

      /**
       * getAll returns all flashes and clears them
       *
       * @return {Array}
       */
      getAll: function () {
        $rootScope.$broadcast('flash.remove');
        var f = angular.copy(flashes);
        flashes = [];
        return f;
      }
    }
  }
];

angular.module('flash.services', [
  'config.services'
]).factory(serv);
