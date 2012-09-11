'use strict';

/**
 * ds.stores.mock provides an in memory mock store for testing.
 */
angular.module('ds.stores.memory', [
  'config',
  'log'
])

  .factory('dsMemory', [
  'config',
  'log',
  '$http',

  function (config, log, $http) {
    var entities = [];
    var index = 0;

    /**
     * genKey create creates a key for storage based upon the kind and id.
     * If and  id is not provided one will be created.
     * @param kind E.g. "user"
     * @param id E.g. "1"
     * @return {String} E.g. 'user|1"
     */
    function genKey(kind, id) {
      id = id || (index += 1);
      return(kind + '|' + id);
    }

    function read(kind, key, obj) {
      obj = entities[genKey(kind, key)];
      var promise;
      return promise;
    }

    function readMulti(kind, keys, objs) {

    }

    function create(kind, obj) {
      var key = genKey(kind, null);
      entities[key] = obj;
      var promise;
      return promise;
    }

    function createMulti(kind, objs) {}
    function update(kind, key, obj) {}
    function updateMulti(kind, keys, objs) {}
    function destroy(kind, key) {}
    function destroyMulti(kind, keys, objs) {}

    return {
      create: create,
      createMulti: createMulti,
      read: read,
      readMulti: readMulti,
//        readAll: readAll,
      update: update,
      updateMulti: updateMulti,
      destroy: destroy,
      destroyMulti: destroyMulti,
    };
  }
]);
