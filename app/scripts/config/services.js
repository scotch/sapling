// Global application configuration
// This module shows how to simply create some constant values used throughout the application
// without polluting **at all** the global namespace. Pretty cool, indeed.

angular.module('config.services', [])

  .factory('config', [
    '$rootScope',

    function ($rootScope) {
      var defaultConfig = {
        API_URL: '/-/api/v1',
        AUTH_URL: '/-/auth',
        AUTH_SUCCESS_URL: '/',
        AUTH_ERROR_URL: '/login',
        AUTH_LOGIN_URL: '/login',
        IMAGE_UPLOAD_URL: '/-/images'
      };

      return defaultConfig;
    }
  ]);