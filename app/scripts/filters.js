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

  // This one replace a piece of text by an commonly used url. It has no dependency.
  .filter('iconify', [
    function() {
      return function (text) {
        return '//s2.googleusercontent.com/s2/favicons?domain=' + text;
      }
    }
  ]);
