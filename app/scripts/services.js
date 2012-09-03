// Simple service that returns the application version
// A simpler version would be .value('version', '0.1'); instead of .factory(...);

angular.module('app.services', [])
  .factory('version', function() {
    return "0.1";
  });
