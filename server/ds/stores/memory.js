/**
 * Simple in memory cache
 * @type {MemoryStore}
 */
var MemoryStore = function () {

  var entities = [];
  var index = 0;

  var NotFound = new Error('Entity not found');

  function getId() {
    return index += 1;
  }

  /**
   * genKey create creates a key for storage based upon the kind and id.
   * If and  id is not provided one will be created.
   * @param kind E.g. "user"
   * @param id E.g. "1"
   * @return {String} E.g. 'user|1"
   */
  function genKey(kind, id) {
    return(kind.toLowerCase() + '|' + id);
  }

  function read(kind, key, callback) {
    var obj = entities[genKey(kind, key)];
    if (!obj) {
      callback(NotFound, null);
    }
    return callback(null, obj);
  }

  // TODO implement
  function readMulti(kind, keys, objs, callback) {}
  // TODO implement
  function readAll(kind, keys, objs, callback) {}

  function create(kind, obj, callback) {
    obj.id = getId();
    entities[genKey(kind, obj.id)] = obj;
    return callback(null, obj);
  }
  // TODO implement
  function createMulti(kind, objs) {}

  function update(kind, key, obj, callback) {
    var o = entities[genKey(kind, key)];
    if (!o) {
      return callback(NotFound, null);
    }
    entities[genKey(kind, key)] = obj;
    return callback(null, obj);
  }
  // TODO implement
  function updateMulti(kind, keys, callback) {}

  function destroy(kind, key, callback) {
    entities[genKey(kind, key)] = null;
    return callback(null, null);
  }
  // TODO implement
  function destroyMulti(kind, keys, callback) {}

  function findByAttribute(kind, attrKey, attrValue, callback) {
    for (var i = 0, len = entities.length; i < len; i++) {
      if (entities[i][attrKey] === attrValue) {
        return callback(null, entities[i]);
      }
    }
    return callback(NotFound, null);
  }

  return {
    genKey: genKey,
    create: create,
    createMulti: createMulti,
    read: read,
    readMulti: readMulti,
    readAll: readAll,
    findByAttribute: findByAttribute,
    update: update,
    updateMulti: updateMulti,
    destroy: destroy,
    destroyMulti: destroyMulti
  };
}();

module.exports = MemoryStore;