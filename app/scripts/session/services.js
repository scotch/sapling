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