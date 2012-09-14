(function() {
  'use strict';

// Declare application level module which depends on additional filters and services (most of them are custom)
var App = angular.module('app', [
  'ngCookies',
  'ngResource',
  'account',
  'config',
  'user',
  'app.controllers',
  'app.directives',
  'app.filters',
  'app.services'
]);

// Configure application $route, $location and $http services.
App.config([
  '$routeProvider',
  '$locationProvider',
  '$httpProvider',

  function ($routeProvider, $locationProvider, $httpProvider) {

    // List of routes of the application
    $routeProvider
      // Pages
      .when('/', {templateUrl : '/partials/home.html'})
      .when('/about', {templateUrl : '/partials/about.html'})

      // Authentication
      .when('/auth', {redirectTo : '/auth/login'})
      .when('/auth/login', {templateUrl : '/partials/auth/login.html'})
      .when('/signup', {templateUrl : '/partials/account/signup.html'})
      .when('/login', {templateUrl : '/partials/account/login.html'})

      // Account
      // `auth : true` is a custom value passed to current route
      .when('/account', {redirectTo : '/account/overview'})
      .when('/account/', {auth : true, redirectTo : '/account/overview'})
      .when('/account/recovery', {templateUrl : '/partials/account/recovery.html'})
      .when('/account/email', {auth : true, templateUrl : '/partials/account/email.html'})
      .when('/account/overview', {auth : true, templateUrl : '/partials/account/overview.html'})
      .when('/account/connected', {auth : true, templateUrl : '/partials/account/connected.html'})
      .when('/account/password', {auth : true, templateUrl : '/partials/account/password.html'})
      .when('/account/profile', {auth : true, templateUrl : '/partials/account/profile.html'})
      .when('/account/signup', {templateUrl : '/partials/account/profile.html'})

      // 404
      .when('/404', {templateUrl : '/partials/errors/404.html'})
      // Catch all
      .otherwise({redirectTo : '/404'});

    // Without serve side support html5 must be disabled.
    $locationProvider.html5Mode(true);

    // Intercept http request responses to broadcast complete and error statuses
//    $httpProvider.responseInterceptors.push(['$q', '$rootScope', function ($q, $rs) {
//      return function (p) {
//        p.then(
//          function (rsp) {
////            $rs.$broadcast('rpc.status', 'complete');
//            return rsp;
//          },
//          function (rsp) {
////            $rs.$broadcast('rpc.status', 'error');
//            $q.reject(rsp);
//          }
//        );
//      };
//    }]);
  }
]);

}).call(this);

(function() {
  'use strict';

// Bootstrap (= launch) application
angular.element(document).ready(function(){
  angular.bootstrap(document, ['app']);
});

}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.connected module provides the AccountConnectedCtrl Controller.
 *
 * Overview of all connected accounts
 * Used in assets/partials/account/connected.html
 */

angular.module('account.controllers.connected', [

])

  .controller('AccountConnectedCtrl', [
    '$scope',
    'authProfile',

    function ($scope, ap) {
      $scope.AuthProfiles = ap.All();
    }
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.connected module provides the AccountEmailCtrl Controller.
 *
 * Manage emails associated with account
 * Used in assets/partials/account/email.html
 */

angular.module('account.controllers.email', [
  'config',
  'flash',
  'user'
])

  .controller('AccountEmailCtrl', [
    '$scope',
    'user',

    function ($scope, user) {
//      $scope.emails = user.emails();
    }
  ]);
}).call(this);

(function() {
  /**
 * account.controller module provides all account controllers.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('account.controllers', [
  'account.controllers.connected',
  'account.controllers.email',
  'account.controllers.login',
  'account.controllers.main',
  'account.controllers.overview',
  'account.controllers.password',
  'account.controllers.profile',
  'account.controllers.recovery',
  'account.controllers.signup'
]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.login module provides the AccountLoginCtrl Controller.
 *
 * Login user and display error messages
 * Used in assets/partials/account/login.html
 */

angular.module('account.controllers.login', [
  'config',
  'flash',
  'session'
])

  .controller('AccountLoginCtrl', [
    '$scope',
    'config',
    'flash',
    '$location',
    'session',

    function ($scope, config, flash, $location, session) {
      // Note: third party authentication is handled by AccountMainCtrl in the
      // account.controllers.main module

      $scope.login = function(user) {
        session.create(user, $scope.session)
          .success(function (data, status) {
            $location.url('/account');
            flash.add('Password updated successfully', 'success');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.main module provides the AccountMainCtrl Controller.
 *
 * Main controller. Others are sub-controllers inheriting from its scope members and methods.
 * Used in assets/index.html
 */

angular.module('account.controllers.main', [
  'config',
  'flash',
  'user'
])

  .controller('AccountMainCtrl', [
    '$scope',
    'config',
    'flash',
    '$location',
    '$timeout',
    'user',
    'session',
    'account.providers',

    function ($scope, config, flash, $location, $timeout, user, session, providers) {


      // retrieve the current user
      $scope.session = session.current();
      $scope.user = user.current();

      // Globals
      $scope.providers = providers.Providers;

      // Functions
      // Open a popup to authenticate users, and redirect to account page on success
      $scope.authenticate = function (provider, w, h) {
        // default values for parameters
        w = w || 400;
        h = h || 350;

        var url = provider.url,
          left = (screen.width / 2) - (w / 2),
          top = (screen.height / 2) - (h / 2),
          targetWin = window.open(url, 'authWindow', 'toolbar=no, location=1, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        (function tick() {
          var p = targetWin.location.pathname;

          // Authentication succeeded
          if (p == config.AUTH_SUCCESS_REDIRECT_URL) {
            targetWin.close();
            $scope.user = user.current();
            $location.url('/account');
          }
          // Authentication failed "normally"
          else if (p === config.AUTH_ERROR_REDIRECT_URL) {
            targetWin.close();
            $scope.ErrMsgs.push('An error occured please try again.');
          }
          // Authentication failed, try again in one second
          else {
            $timeout(tick, 1000);
          }
        })();

      };

      $scope.logout = function () {
        session.destroy()
          .success(function (data, status) {
            flash.add('You have been logged out successfully', 'success');
          })
          .error(function (data, status) {
            flash.error('An error occurred please try again', 'error');
          });

        // Redirect regardless of error.
        $location.url(config.AUTH_LOGOUT_REDIRECT);
      };

    }
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.overview module provides the AccountOverviewCtrl Controller.
 *
 * Account overview
 * Used in assets/partials/account/overview.html
 */

// TODO: Overview of user account and user options
angular.module('account.controllers.overview', [
  'config',
  'flash',
  'user'
])

  .controller('AccountOverviewCtrl', [
    '$scope',

    function ($scope) {}
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.password module provides the AccountPasswordCtrl Controller.
 *
 * Add/edit password to user account
 * Used in assets/partials/account/password.html
 */

angular.module('account.controllers.password', [
  'config',
  'flash',
  'user'
])

  .controller('AccountPasswordCtrl', [
    '$scope',
    'flash',
    'user',

    function ($scope, flash, user) {
      $scope.updateUser = function (u) {
        user.update(u)
          .success(function (data, status) {
            flash.add('Password updated successfully', 'success');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.profile module provides the AccountProfileCtrl Controller.
 *
 * Edit account profile
 * Used in assets/partials/account/profile.html
 */

angular.module('account.controllers.profile', [
  'config',
  'flash',
  'user'
])

  .controller('AccountProfileCtrl', [
    '$scope',
    'flash',
    'user',

    function ($scope, flash, user) {
      $scope.updateUser = function (u) {
        user.update(u)
          .success(function (data, status) {
            // TODO redirect?
            flash.add('Profile updated successfully', 'success');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.recovery module provides the AccountRecoveryCtrl Controller.
 *
 * Add/edit password to user account
 * Used in assets/partials/account/recovery.html
 */

// TODO: Recover user account
angular.module('account.controllers.recovery', [
  'config',
  'flash',
  'user'
])

  .controller('AccountRecoveryCtrl', [
    '$scope',

    function ($scope) {}
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * account.controllers.signup module provides the AccountSignupCtrl Controller.
 *
 * Signup user and display error messages
 * Used in assets/partials/account/signup.html
 */

angular.module('account.controllers.signup', [
  'config',
  'flash',
  'user'
])

  .controller('AccountSignupCtrl', [
    '$scope',
    '$location',
    'user',
    'flash',

    function ($scope, $location, user, flash) {
      $scope.createAccount = function (u) {
        user.create(u)
          .success(function (data, status) {
            flash.add('Account created successfully', 'success');
            $location.url('/account');
          })
          .error(function (data, status) {
            flash.add('An error occurred please try again', 'error');
          });
      };
    }
  ]);
}).call(this);

(function() {
  /**
 * account provides controllers and services useful when working with User accounts.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('account', ['account.controllers', 'account.services']);
}).call(this);

(function() {
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
}).call(this);

(function() {
  /**
 * config provides global application configuration.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('config', ['config.services']);
}).call(this);

(function() {
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
        AUTH_LOGOUT_REDIRECT: '/',
        AUTH_SIGNUP_REDIRECT_URL: '/signup',
        AUTH_SUCCESS_REDIRECT_URL: '/',

        // possible values: 'disable' || 'assert' || 'error' || 'warn' || 'info' || 'debug'
        LOG_LEVEL: 'debug',

        IMAGE_UPLOAD_URL: '/-/images'
      };

      return defaultConfig;
    }
  ]);
}).call(this);

(function() {
  'use strict';

// Define the application level controllers
angular.module('app.controllers', [])
  // the AppCtrl is used in index.html (see app/assets/index.html)
  .controller('AppCtrl', [
    '$scope',
    '$location',

    function ($scope, $location) {

      // TODO moved these to directives

      // 'rpc.status' is a channel used to broadcast messages. It's defined in rpc/services.js
      $scope.$on('rpc.status', function (e, d) {
        if (d === 'waiting')
          $scope.WaitText = 'Working...';
        else
          $scope.WaitText = false;
      });

      // Uses the url to determine if the selected
      // menu item should have the class active.
      $scope.$location = $location;
      $scope.$watch('$location.path()', function (path) {
          $scope.activeNavId = path || '/';
        }
      );

      // getClass compares the current url with the id.
      // If the current url starts with the id it returns 'active'
      // otherwise it will return '' an empty string. E.g.
      //
      //   # current url = '/products/1'
      //  getClass('/products') # returns 'active'
      //  getClass('/orders') # returns ''
      $scope.getClass = function (id) {
        if($scope.activeNavId.substring(0, id.length) == id)
          return 'active';
        else
          return '';
      }
    }
  ])

  // Just placeholders controllers. To be filled with your own logic.
  .controller('MyCtrl1', [
    '$scope',
    function ($scope) {
      return $scope;
    }
  ])

  .controller('MyCtrl2', [
    '$scope',
    function ($scope) {
      return $scope;
    }
  ]);
}).call(this);

(function() {
  'use strict';

// register the module with Angular
angular.module('app.directives', [
  // require the 'app.service' module
  'app.services'
])
  .directive('appVersion', [
    // this directive depends specifically on the 'version' service from 'app.service'
    'version',
    function (version) {
      return function (scope, elm, attrs) {
        return elm.text(version);
      }
    }
  ]);
}).call(this);

(function() {
  /**
 * ds module provides a ds services.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('ds', ['ds.services']);
}).call(this);

(function() {
  'use strict';

/**
 * ds.services providers cached persistence for data structures.
 *
 * What does that mean?
 *
 * E.g.
 *  var u = {'name': {'givenName': 'Kyle'}};
 *  ds.create('User', u);
 *  // after return form sever
 *  u.id // '1' populated from the server
 */


// TODO added other stores
angular.module('ds.services', [
  'config.services',
  'ds.stores.rest',
  'log'
])

  .factory('ds', [
    'config',
    'log',
    '$http',
    'dsRest',

    function (config, log, $http, dsRest) {

      var kinds = {defaultStore: [dsRest]};

      function getStores(kind) {
        return kinds[kind] || kinds['defaultStore'];
      }

      function register(kind, stores) {
        log.assert(angular.isArray(stores), 'ds: stores must be an array');
        kinds[kind] = stores;
      }

      function get(kind, key, obj) {
        // return dsRest.read(kind, key, obj);
        var stores = getStores(kind);
        var promise;
        for (var i = 0, l = stores.length; i < l ; i++) {
          promise = stores[i].read(kind, key, obj);
        }
        return promise;
      }

      function put(kind, obj) {
        return dsRest.create(kind, obj);
      }

      function create(kind, obj) {
        return dsRest.create(kind, obj);
      }

      function update(kind, key, obj) {
        return dsRest.update(kind, key, obj);
      }

      return {
        register: register,
        get: get,
        put: put,
//        destroy: destroy,
        create: create,
        update: update
      };
    }
  ]);
}).call(this);

(function() {
  'use strict';

/**
 * ds.stores.mock provides an in memory mock store for testing.
 */
angular.module('ds.stores.memory', [
  'config',
  'log'
])

  .factory('dsMemory', [
  'config',
  'log',
  '$http',

  function (config, log, $http) {
    var entities = [];
    var index = 0;

    /**
     * genKey create creates a key for storage based upon the kind and id.
     * If and  id is not provided one will be created.
     * @param kind E.g. "user"
     * @param id E.g. "1"
     * @return {String} E.g. 'user|1"
     */
    function genKey(kind, id) {
      id = id || (index += 1);
      return(kind + '|' + id);
    }

    function read(kind, key, obj) {
      obj = entities[genKey(kind, key)];
      var promise;
      return promise;
    }

    function readMulti(kind, keys, objs) {

    }

    function create(kind, obj) {
      var key = genKey(kind, null);
      entities[key] = obj;
      var promise;
      return promise;
    }

    function createMulti(kind, objs) {}
    function update(kind, key, obj) {}
    function updateMulti(kind, keys, objs) {}
    function destroy(kind, key) {}
    function destroyMulti(kind, keys, objs) {}

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
    };
  }
]);

}).call(this);

(function() {
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

}).call(this);

(function() {
  
}).call(this);

(function() {
  'use strict';

// Simple filters
angular.module('app.filters', [])
  // This one replaces %VERSION% by the actual version provided by the version service (app/scripts/services.js),
  // hence the dependency with 'version'
  .filter('interpolate', [
    'version',
     function (version) {
       return function (text) {
         return String(text).replace(/\%VERSION\%/mg, version);
       }
     }
  ])

  // iconify turns a url into image. It has no dependency.
  .filter('iconify', [
    function() {
      return function (url) {
        return '//s2.googleusercontent.com/s2/favicons?domain=' + url;
      };
    }
  ]);

}).call(this);

(function() {
  /**
 * flash provides broadcast of messages to all scopes
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('flash', ['flash.services']);
}).call(this);

(function() {
  'use strict';

// Service to broadcast messages to all scopes, since the $broadcast call is made from the $rootScope

angular.module('flash.services', [
  'config.services'
])

  .factory('flash', [
    '$rootScope',

    function ($rootScope) {
      var flashes = [];

      return {

        /**
         * add adds a single flash message.
         *
         * @param message
         *  A string representing the flash message
         * @param level
         *  the classification of the flash options are:
         *  - 'info' // the default
         *  - 'success'
         *  - 'error'
         */
        add: function (message, level) {
          // default value for the level parameter
          level = level || 'info';

          var flash = {
            message: message,
            level: level
          };
          flashes.push(flash);

          // tell child scope that this flash has been added
          $rootScope.$broadcast('flash.add', flash);
        },

        /**
         * all returns all flashes, but does **not** clear them
         * @return {Array}
         */
        all: function () {
          return flashes;
        },

        /**
         * clear removes all flashes
         */
        clear: function () {
          $rootScope.$broadcast('flash.clear', true);
          flashes = [];
        },

        /**
         * getAll returns all flashes and clears them
         *
         * @return {Array}
         */
        getAll: function () {
          $rootScope.$broadcast('flash.remove');
          var f = angular.copy(flashes);
          flashes = [];
          return f;
        }
      };
    }
  ]);


}).call(this);

(function() {
  /**
 * log module provides a logging services.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('log', ['log.services']);
}).call(this);

(function() {
  'use strict';

/**
 * log.service provides a logging service.
 *
 * log extend the angular service `$log` by adding the `assert` method,
 * which will raise an error. It also, provides a way to silence errors,
 * by setting the config constant LOG_LEVEL in config module.
 *
 * possible values: 'disable' || 'assert' || 'error' || 'warn' || 'info' || 'debug'
 */

// TODO: should assert be in it's own service?
angular.module('log.services', [
  'config.services'
])

  .factory('log', [
    'config',
    '$log',

    function (config, $log) {

      var logMap = {
        'disable': 0,
        'assert': 1,
        'error': 2,
        'warn': 3,
        'info': 2,
        'debug': 4
      };

      function consoleLog(type) {
        return function() {
          if (logMap[type] >= logMap[config.LOG_LEVEL]) {
            if (type === 'assert') {
              if (!arguments[0]) {
                new Error('assertion failed: ' + arguments[1]);
              }
            } else {
              $log[type](arguments[0]);
            }
          }
        };
      }

      return {
        log:    consoleLog('log'),
        warn:   consoleLog('warn'),
        info:   consoleLog('info'),
        error:  consoleLog('error'),
        assert: consoleLog('assert')
      };
    }
  ]);
}).call(this);

(function() {
  'use strict';

// Service that issues RPC requests to the back end

angular.module('rpc.services', [
  'config.services'
])

  .factory('rpc', [
    'config',
    '$http',
    '$rootScope',

    function (config, $http, $rootScope) {
      var randNumber = function () {
        return parseInt(Math.random() * 1000000000, 10);
      };

      return {
        run: function (method, params) {
          $rootScope.$broadcast('rpc.status', 'waiting');

          var p = [];
          if (params) {
            p = [params];
          }

          var obj = {
            Method: method,
            Params: p,
            Id: randNumber()
          };

          return $http.post(config.API_BASE_URL, obj);
        }
      };
    }
  ]);

}).call(this);

(function() {
  'use strict';

// Simple service that returns the application version
// Using the value method since 'version' is a constant, not a computed value.

angular.module('app.services', [])
  .value('version', '0.1');

}).call(this);

(function() {
  /**
 * session module provides a session services.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('session', ['session.services']);
}).call(this);

(function() {
  'use strict';

/**
 * session.services provides services for interacting with sessions.
 */

angular.module('session.services', [
  'config',
  'log',
  'ds',
  'flash'
])

  .factory('session', [
  'config',
  'flash',
  'log',
  'ds',
  '$location',
  '$rootScope',
  '$route',

  function (config, flash, log, ds, $location, $rootScope, $route) {

    var nextUrl = '';
    /**
     * defaultSession
     *
     * @type {Object}
     */
    var defaultSession = {
      // attributes
      id: '',
      userId: '',
      userName: '',
      roles: [],
      nextUrl: '',

      isAuthenticated: '',
      isAdmin: ''
    };

    /**
     * Session object
     *
     * @param value existing vales you would like to merge.
     * @return a new Session object
     */
      // TODO can the value param be removed?
    function Session(value) {
      return angular.copy(value || defaultSession, this);
    }

    var currentSession = new Session();

    function read(sessionId, session) {
      return ds.get('Session', sessionId, session);
    }

    function create(session) {
      return ds.create('Session', session);
    }

    function update(session) {
      log.assert(session.id, 'user: id is required to preform an update');
      return ds.update('Session', session.id, session);
    }

    function destroy(sessionId) {
      return ds.destroy('Session', sessionId);
    }

    function current() {
      ds.get('Session', 'me', currentSession);
      return currentSession;
    }

    /**
     * Code modified from https://groups.google.com/forum/?fromgroups=#!starred/angular/POXLTi_JUgg
     * By Adam Wynne
     */
    $rootScope.$on("$routeChangeSuccess", function (current) {
      var currentUrl = $location.url(),
        loginUrl = config.AUTH_LOGIN_REDIRECT_URL;
      if (currentUrl !== loginUrl && nextUrl !== loginUrl) {
        $location.url(nextUrl);
        nextUrl = '';
      }
      if ($route.current && $route.current.$route) {
        var auth = $route.current.$route.auth;
        var admin = $route.current.$route.admin;
        // if auth is set
        // E.g. `auth: true` or `auth: false`
        if (auth !== undefined ) {
          // if authentication *IS* required but user is *NOT* authenticated
          if (auth && !currentSession.isAuthenticated) {
            flash.add('You must be logged in to view that. Please log.', 'warn');
            // save current location to session for post authentication redirect
            nextUrl = loginUrl;
//            $location.url(loginUrl);
          }
          // if authentication is *NOT* required but user *IS* authenticated
          if (!auth && currentSession.isAuthenticated) {
            flash.add('You are already logged in', 'info');
            // TODO redirect to previous
//            $location.url('/');
          }
        }
        // if admin is set:
        // E.g. `admin: true` or `admin: false`
        if (admin !== undefined ) {
          // if admin *IS* required but user is *NOT* admin
          if (admin && !currentSession.isAdmin) {
            flash.add('You must be an admin to view that. Please log.', 'warn');
            // save current location to session for post authentication redirect
            nextUrl = currentUrl;
//            $location.url(loginUrl);
          }
          // if admin is *NOT* required but user *IS* an admin
          if (!admin && currentSession.isAdmin) {
            flash.add('You are already logged in', 'info');
            // TODO redirect to previous
//            $location.url('/');
          }
        }
      }
    });

    return {
      Session: Session,
      read: read,
      create: create,
      update: update,
      current: current,
      destroy: destroy
    };
  }
]);
}).call(this);

(function() {
  /**
 * user module provides a user services.
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('user', ['user.services']);
}).call(this);

(function() {
  'use strict';

/**
 * user.services provides services for interacting with user.
 * This service serves as a convenient wrapper for other user related services.
 */

angular.module('user.services', [
  'config',
  'log',
  'ds',
  'flash'
])

  .factory('user', [
    'config',
    'log',
    'ds',
    '$location',
    '$rootScope',
    '$route',

    function (config, log, ds, $location, $rootScope, $route) {

      /**
       * defaultUser
       *
       * @type {Object}
       */
      var defaultUser = {
        // attributes
        id: '',
        name: {
          honorificPrefix: '',
          givenName: '',
          middleName: '',
          familyName: '',
          honorificSuffix: '',
          formatted: '' // TODO change display name into a function so we can use it here.
        },
        email: '',
        emails: [],
        birthday: '',
        gender: '',
        image: '',
        roles: [],
        kind: '',
        provider: '',
        url: '',
        urls: [],
        utcOffset: '',

        // methods
        displayName: function () {
          if (this.name && (this.name.givenName || this.name.familyName)) {
            var a = [];
            a = this.name.givenName ? a.concat(this.name.givenName) : a ;
            a = this.name.familyName ? a.concat(this.name.familyName) : a ;
            if (a.length) {
              return a.join(' ');
            }
          }
          return 'Anonymous User';
        },

        isAuthenticated: function () {
          return this.id !== '';
        },

        isAdmin: function () {
          for (var i = 0, l = this.roles.length ; i < l ; i++) {
            if (this.roles[i] === 'admin') {
              return true;
            }
          }
          return false;
        }
      };

      /**
       * User object
       *
       * @param value existing vales you would like to merge.
       * @return a new User object
       */
      // TODO can the value param be removed?
      function User(value) {
        return angular.copy(value || defaultUser, this);
      }

      var currentUser = new User();

      /**
       * Retrieves a user from the remote server.
       *
       * @url `{API_URL}/user/{userId}`
       * @method GET
       *
       * @param userId the id of the user you would like to retrieve.
       *
       *  @return $http promise
       */
      function get(userId, user) {
        return ds.get('user', userId, user);
      }

      /**
       * Creates a user on the remote server.
       *
       * @url `{API_URL}/user`
       * @method POST
       * @payload {object} User
       *
       * @param user {object} a User object that will be created.
       * Properties:
       *  - email (required)
       *  - password
       *    - new (required)
       *  All other properties are optional
       *  - name
       *    - givenName
       *    - familyName
       *    - middleName
       *
       *  @return $http promise
       *  If an error occurs the promises error function will receive a list of
       *  errors E.g.
       *  [
       *    {
       *      code: 10,
       *      message: 'Invalid email'
       *    }
       *  ]
       */
      function create(user) {
        return ds.create('User', user);
      }

      /**
       * Update updates an existing User with a remote server.
       *
       * @url `{API_URL}/user/{user.id}`
       * @method POST
       * @payload {object} User
       *
       * @param user {object} the User object that will be updated.
       *
       *  @return $http promise
       *  If an error occurs the promises error function will receive a list of
       *  errors E.g.
       *  [
       *    {
       *      code: 10,
       *      message: 'Invalid email'
       *    }
       *  ]
       */
      function update(user) {
        log.assert(user.id, 'user: id is required to preform an update');
        return ds.update('User', user.id, user);
      }

      /**
       * Retrieves the requesting user's user object from a remote server.
       *
       * @url `{API_URL}/user/me`
       * @method GET
       * 
       * @return User object - immediately returns a User object.
       * The object is empty, but will be populated once the server returns.
       */
      function current() {
        ds.get('User', 'me', currentUser);
        return currentUser;
      }

      return {
        User: User,
        get: get,
        create: create,
        update: update,
        current: current
      };
    }
  ]);

}).call(this);

(function() {
  /**
 * userProfile provides a userProfile object.
 * The userProfile object conforms the [portable contacts spec][] with a few additions:
 * TODO Add spec.
 *
 *
 * [portable contacts spec]: http://portablecontacts.net/draft-spec.html
 */

// This module is a added as a convenience.
// The convention is to include all sub-modules that are present in the directory.
angular.module('userProfile', ['userProfile.services']);
}).call(this);

(function() {
  'use strict';

/**
 * userProfile.service provides a userProfile object.
 * You generally will *not* uses the userProfile directly, but instead reference
 * it through other services. E.g. `user` `auth`
 */
angular.module('userProfile.services', [
  'config.services',
  'rpc.services'
])

  .factory('userProfile', [
    'config',

    function (config) {
      // The userProfile Object.
      var defaultUserProfile = {
        // attributes
        id: '',
        name: {
          honorificPrefix: '',
          givenName: '',
          middleName: '',
          familyName: '',
          honorificSuffix: '',
          formatted: '' // TODO change display name into a function so we can use it here.
        },
        email: '',
        emails: [],
        birthday: '',
        gender: '',
        image: '',
        roles: [],
        kind: '',
        provider: '',
        url: '',
        urls: [],
        utcOffset: '',

        // methods
        displayName: function () {
          if (this.name && (this.name.givenName || this.name.familyName)) {
            var a = [];
            a = this.name.givenName ? a.concat(this.name.givenName) : a ;
            a = this.name.familyName ? a.concat(this.name.familyName) : a ;
            if (a.length)
             return a.join(' ');
          }
          return 'Anonymous User';
        },
        isAuthenticated: function() {
          return this.id != '';
        },
        isAdmin: function() {
          for (var i = 0, l = this.roles.length ; i < l ; i++) {
            if (roles[i] === 'admin') {
              return true;
            }
          }
          return false;
        }
      };

      // New returns a new userProfile object
      return {
        /**
         * new creates a new UserProfile.
         * @param value
         * @return {object} a UserProfile object
         */
        new: function (value) {
          return angular.copy(value || defaultUserProfile, this);
        }
      }
    }
  ]);


}).call(this);

