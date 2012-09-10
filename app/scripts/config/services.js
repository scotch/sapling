'use strict';

// Global application configuration
// This module shows how to simply create some constant values used throughout the application
// without polluting **at all** the global namespace. Pretty cool, indeed.

angular.module('config.services', [])

  .factory('config', [

    function () {
      var defaultConfig = {
        API_BASE_URL: '/-/api/v1',

        AUTH_URL: '/-/auth',
        AUTH_ERROR_REDIRECT_URL: '/login',
        AUTH_LOGIN_REDIRECT_URL: '/login',
        AUTH_SIGNUP_REDIRECT_URL: '/signup',
        AUTH_SUCCESS_REDIRECT_URL: '/',

        // possible values: 'disable' || 'assert' || 'error' || 'warn' || 'info' || 'debug'
        LOG_LEVEL: 'debug',

        IMAGE_UPLOAD_URL: '/-/images'
      };

      return defaultConfig;
    }
  ]);