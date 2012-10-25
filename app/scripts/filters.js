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
      };
    }
  ])

  // iconify turns a url into image. It has no dependency.
  .filter('iconify', [
    function () {
      return function (url) {
        return '//s2.googleusercontent.com/s2/favicons?domain=' + url;
      };
    }
  ]);
