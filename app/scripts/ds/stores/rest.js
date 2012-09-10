'use strict';

angular.module('ds.stores.rest', [
  'config',
  'log'
])

  .factory('dsRest', [
    'config',
    'log',
    '$http',

    function (config, log, $http) {

      // plurals contains custom plurals. E.g "people" for "person"
      var plurals = {};

      // converts a singular name to it's plural.
      function pluralize(name) {
        return plurals[name] || name + "s";
      }

      function buildUrl(kind, key) {
        var url = [];
        url.push(config.API_BASE_URL);
        url.push(pluralize(angular.lowercase(kind)));
        if (key) {
          url.push(key);
        }
        return url.join("/");
      }

      /**
       * addPlural adds a plural definition for a resource to the plurals list.
       *  This list is checked *first* when creating the RESTful routes.
       *
       * @param singular the singular name E.g. "person"
       * @param plural the plural name and the name that will be used in the
       *  route. E.g. "people"
       */
      function addPlural(singular, plural) {
        plurals[angular.lowercase(singular)] = angular.lowercase(plural);
      }

      function read(kind, key, obj) {
        var url = buildUrl(kind, key);
        var promise = $http.get(url);
        promise.then(function (result) {
          if (obj) {
            angular.extend(obj, result.data);
          }
          return result;
        });
        return promise;
      }

      function readMulti(kind, keys, objs) {
        log.assert(angular.isArray(keys), "readMulti, requires an array of keys");
        log.assert(angular.isArray(objs), "readMulti, requires an array of objs");
        var promises = [];
        angular.forEach(objs, function (i) {
          this.push(read(kind, keys[i], objs[i]));
        }, promises);
        return promises;
      }

      function create(kind, obj) {
        var url = buildUrl(kind);
        var promise = $http.post(url, obj);
        promise.then(function (result) {
          angular.extend(obj, result.data);
          return result;
        });
        return promise;
      }

      function createMulti(kind, objs) {
        log.assert(angular.isArray(objs), "createMulti, requires an array");
        var promises = [];
        angular.forEach(objs, function (i) {
          this.push(create(kind, objs[i]));
        }, promises);
        return promises;
      }

      function update(kind, key, obj) {
        var url = buildUrl(kind, key);
        var promise = $http.put(url, obj);
        promise.then(function (result) {
          angular.extend(obj, result.data);
          return result;
        });
        return promise;
      }

      function updateMulti(kind, keys, objs) {
        log.assert(angular.isArray(objs), "updateMulti, requires an array of objs");
        log.assert(angular.isArray(keys), "updateMulti, requires an array of keys");
        var promises = [];
        angular.forEach(objs, function (i) {
          this.push(update(kind, keys[i], objs[i]));
        }, promises);
        return promises;
      }

      function destroy(kind, key) {
        var url = buildUrl(kind, key);
        var promise = $http.delete(url, obj);
        promise.then(function (result) {
          angular.extend(obj, result.data);
          return result;
        });
        return promise;
      }

      function destroyMulti(kind, keys, objs) {
        log.assert(angular.isArray(keys), "destroyMulti, requires an array of keys");
        var promises = [];
        angular.forEach(objs, function (i) {
          this.push(destroy(kind, keys[i]));
        }, promises);
        return promises;
      }

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
        addPlural: addPlural
      };
    }
  ]);
