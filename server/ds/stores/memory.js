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

  function findById(kind, id, callback) {
    var idx = id - 1;
    if (entities[idx]) {
      callback(null, entities[idx]);
    } else {
      callback(NotFound, null);
    }
  }

  function findByAttribute(kind, attrKey, attrValue, callback) {
    for (var i = 0, len = entities.length; i < len; i++) {
      if (entities[i][attrKey] === attrValue) {
        return callback(null, entities[i]);
      }
    }
    return callback(NotFound, null);
  }

  function create(kind, obj, callback) {
    obj.id = getId();
    entities.push(obj);
    return callback(null, obj);
  }

  function update(kind, id, obj, callback) {
    var idx = id - 1;
    entities[idx] = obj;
    return callback(null, obj);
  }

  function destroy(kind, id, callback) {
    // TODO
    return callback(null, null);
  }

  function clear(callback) {
    entities = [];
    index = 0;
    return callback(null);
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