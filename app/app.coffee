# Declare app level module which depends on filters, and services
App = angular.module('app', [
  'ngCookies'
  'ngResource'
  'app.controllers'
  'app.directives'
  'app.filters'
  'app.services'
  'account.controllers'
  'auth.password.services'
  'auth.profile.services'
  'config.services'
  'rpc.services'
  'user.services'
])

App.config([
  '$routeProvider'
  '$locationProvider'
  '$httpProvider'

($routeProvider, $locationProvider, $httpProvider) ->

  $routeProvider
    # Pages
    .when('/', {templateUrl: '/partials/home.html'})
    .when('/about', {templateUrl: '/partials/about.html'})

    # Auth
    .when('/auth', {redirectTo: '/auth/login'})
    .when('/auth/login', {templateUrl: '/partials/auth/login.html'})

    .when('/signup', {templateUrl: '/partials/account/signup.html'})
    .when('/login', {templateUrl: '/partials/account/login.html'})
    # Account
    .when('/account', {redirectTo: '/account/overview'})
    .when('/account/', {redirectTo: '/account/overview'})
    .when('/account/recovery', {templateUrl: '/partials/account/recovery.html'})
    .when('/account/email', {templateUrl: '/partials/account/email.html'})
    .when('/account/overview', {templateUrl: '/partials/account/overview.html'})
    .when('/account/connected', {templateUrl: '/partials/account/connected.html'})
    .when('/account/password', {templateUrl: '/partials/account/password.html'})
    .when('/account/profile', {templateUrl: '/partials/account/profile.html'})

    .when('/account/signup', {templateUrl: '/partials/account/profile.html'})

    # 404
    .when('/404', {templateUrl: '/partials/errors/404.html'})
    # Catch all
    .otherwise({redirectTo: '/404'})

  # Without serve side support html5 must be disabled.
  $locationProvider.html5Mode(true)

  # intercept http request responses to broadcast complete and error statuses
  $httpProvider.responseInterceptors.push(['$q', '$rootScope', ($q, $rs) ->
    (p) ->
      p.then(
        (rsp) ->
          $rs.$broadcast 'rpc.status', 'complete'
          return rsp
        ,
        (rsp) ->
          $rs.$broadcast 'rpc.status', 'error'
          $q.reject(rsp)
      )
  ])
])
