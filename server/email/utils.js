
exports.validateEmail = function (address) {
  if (address.indexOf('@') === -1) {
    return false;
  }
  if (address.indexOf('.') === -1) {
    return false;
  }
  return true;
};