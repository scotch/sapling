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