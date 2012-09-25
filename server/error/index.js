/**
 * Application wide error codes
 * @type {ErrorCodes}
 */

// Grab the util module that's bundled with Node
var util = require('util');

var Errors = function () {
  // From http://dustinsenos.com/articles/customErrorsInNode
  // Create a new Abstract Error constructor
  var AbstractError = function (code, msg, constr) {
    // If defined, pass the constr property to V8's
    // captureStackTrace to clean up the output
    Error.captureStackTrace(this, constr || this);

    // If defined, store a custom error message
    this.message = msg || 'Error';

    // if defined store the code
    this.code = code;
  };

  // Extend our AbstractError from Error
  util.inherits(AbstractError, Error);

  // Give our Abstract error a name property. Helpful for logging the error later.
  AbstractError.prototype.name = 'Abstract Error';

  // Give our Abstract error a code property. Helpful for logging the error later.
  AbstractError.prototype.code = 0;

  // Create the ApiError
  var ApiError = function (code, msg) {
    ApiError.super_.call(this, code, msg, this.constructor);
  };
  util.inherits(ApiError, AbstractError);

  ApiError.prototype.message = 'API Error';
  return {
    AbstractError: AbstractError,
    ApiError: ApiError,
    invalidEmailError:           new ApiError(10, 'invalid email address'),
    invalidPasswordLengthError:  new ApiError(11, 'invalid password length'),
    invalidPasswordError:        new ApiError(12, 'invalid password or email'),
    emailInUseError:             new ApiError(13, 'email in use'),
    notFoundError:               new ApiError(404, 'entity not found'),
  };
}();

module.exports = Errors;