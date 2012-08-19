angular.module('ds.services', [
  'config.services'
  'rpc.services'
])

.factory('user', [
  'config'
  '$rootScope'
  'rpc'

(cnfg, $rootScope, rpc) ->

  kinds = {}
  stores = {}

  # return
  Register: (kind, useLocal, useServer) ->
  NewKey: (kind, stringID) ->
])
