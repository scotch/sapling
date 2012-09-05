'use strict';

// Declare application level module which depends on additional filters and services (most of them are custom)
var App = angular.module('app',
  ['ngCookies',
    'ngResource',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'account.controllers',
    'auth.password.services',
    'auth.profile.services',
    'config.services',
    'rpc.services',
    'user.services']);

// Configure application $route, $location and $http services.
App.config(
  ['$routeProvider',
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
    $httpProvider.responseInterceptors.push(['$q', '$rootScope', function ($q, $rs) {
      return function (p) {
        p.then(
          function (rsp) {
            $rs.$broadcast('rpc.status', 'complete');
            return rsp;
          }
          ,
          function (rsp) {
            $rs.$broadcast('rpc.status', 'error');
            $q.reject(rsp);
          }
        );
      }
    }]);
  }
]);
