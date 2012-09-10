'use strict';

/**
 * ds.services providers cached persistence for data structures.
 *
 * What does that mean?
 *
 * E.g.
 *  var u = {'name': {'givenName': 'Kyle'}};
 *  ds.create('User', u);
 *  // after return form sever
 *  u.id // '1' populated from the server
 */


// TODO added other stores
angular.module('ds.services', [
  'config.services',
  'ds.stores.rest',
  'log'
])

  .factory('ds', [
    'config',
    'log',
    '$http',
    'dsRest',

    function (config, log, $http, dsRest) {

      var kinds = {defaultStore: [dsRest]};

      function getStores(kind) {
        return kinds[kind] || kinds['defaultStore'];
      }

      function register(kind, stores) {
        log.assert(angular.isArray(stores), 'ds: stores must be an array');
        kinds[kind] = stores;
      }

      function get(kind, key, obj) {
        // return dsRest.read(kind, key, obj);
        var stores = getStores(kind);
        var promise;
        for (var i = 0, l = stores.length; i < l ; i++) {
          promise = stores[i].read(kind, key, obj);
        }
        return promise;
      }

      function put(kind, obj) {
        return dsRest.create(kind, obj);
      }

      function create(kind, obj) {
        return dsRest.create(kind, obj);
      }

      function update(kind, key, obj) {
        return dsRest.update(kind, key, obj);
      }

      return {
        register: register,
        get: get,
        put: put,
//        destroy: destroy,
        create: create,
        update: update
      };
    }
  ]);