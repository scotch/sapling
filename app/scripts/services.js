'use strict';

// Simple service that returns the application version
// Using the value method since 'version' is a constant, not a computed value.

angular.module('app.services', [])
  .value('version', '0.1');
