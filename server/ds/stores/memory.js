'use strict';

/**
 *  **Not for production use**
 * An inefficient in memory cache.
 * @type {MemoryStore}
 */
var MemoryStore = function () {

  var entities = [];
  var index = 0;

  var NotFound = new Error('Entity not found');

  function getId() {
    return index += 1;
  }

  function genKey(kind, id) {
    return(kind.toLowerCase() + '|' + id);
  }

  function findById(kind, id, fn) {
    var idx = id - 1;
    if (entities[idx]) {
      fn(null, entities[idx]);
    } else {
      fn(NotFound, null);
    }
  }

  function findByAttribute(kind, attrKey, attrValue, fn) {
    for (var i = 0, len = entities.length; i < len; i++) {
      if (entities[i][attrKey] === attrValue) {
        return fn(null, entities[i]);
      }
    }
    return fn(NotFound, null);
  }

  function create(kind, obj, fn) {
    obj.id = getId();
    entities.push(obj);
    return fn(null, obj);
  }

  function update(kind, id, obj, fn) {
    var idx = id - 1;
    entities[idx] = obj;
    return fn(null, obj);
  }

  function destroy(kind, id, fn) {
    // TODO
    return fn(null, null);
  }

  function clear(fn) {
    entities = [];
    index = 0;
    return fn(null);
  }

  return {
    genKey: genKey,
    create: create,
    findById: findById,
    findByAttribute: findByAttribute,
    update: update,
    destroy: destroy,
    clear: clear,
  };
}();

module.exports = MemoryStore;
