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
      };
    }
  ]);
