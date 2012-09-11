'use strict';

/**
 * account.services module provides services useful in working with User accounts.
 * Including:
 *   account.errors
 *   account.providers
 *
 */

// TODO this should be handled differently. A more modular approach is needed
// something that will allow errors to be registered.
// TODO add internationalization

angular.module('account.services', [])

  .factory('account.errors', [
    'config',

    function (config) {
      var internalServer  = 500,
        emailInUse      = 401,
        invalidAddress  = 402,
        passwordLength  = 403;

      // errorText is the text representation of the error..
      var errorText = {
        internalServer:  'A Sever Error occured. Please try again.',
        emailInUse:      'Email address in use. Try <a href="' + config.AUTH_LOGIN_REDIRECT_URL + '">Logging in</a>',
        invalidAddress:  'Account not found for email address. Try <a href="' + config.AUTH_SIGNUP_REDIRECT_URL + '">Create Account</a>',
        passwordLength:  'Password must be between 4 -32 characters'
      };

      return {
        /**
         * errorText returns the error text given an error code
         *
         * @param code
         * @return {String}
         */
        errorText: function (code) {
          return errorText[code]
        }

      };
    }
  ])

  .factory('account.providers', [
    'config',

    function (config) {
      var providers = [
        {name: 'google+',   url: config.AUTH_URL + '/google'},
        {name: 'facebook',  url: config.AUTH_URL + '/facebook'},
        {name: 'twitter',   url: config.AUTH_URL + '/twitter'},
        {name: 'linkedin',  url: config.AUTH_URL + '/linkedin'},
        {name: 'github',    url: config.AUTH_URL + '/github'},
        {name: 'google',    url: config.AUTH_URL + '/appengine_openid?provider=gmail.com'},
        {name: 'yahoo',     url: config.AUTH_URL + '/appengine_openid?provider=yahoo.com'},
        {name: 'myspace',   url: config.AUTH_URL + '/appengine_openid?provider=myspace.com'},
        {name: 'aol',       url: config.AUTH_URL + '/appengine_openid?provider=aol.com'}
      ];
      return {
        providers: providers
      }
    }
  ]);