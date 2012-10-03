'use strict';

// validateEmail is a simple email validator. It confirms that the provided
// string contains a `@` and a `.`
// TODO maybe use a regex here.
exports.validateEmail = function (address) {
  if (!address) {
    return false;
  }
  if (address.indexOf('@') === -1) {
    return false;
  }
  if (address.indexOf('.') === -1) {
    return false;
  }
  return true;
};
