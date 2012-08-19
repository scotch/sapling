angular.module('rpc.services', [
  'config.services'
])

.factory('rpc', [
  'config'
  '$http'
  '$rootScope'
  '$q'

(cnfg, $http, rs, $q) ->
  randNumber = ->
    return parseInt(Math.random()*1000000000, 10)
  # return
  Run: (method, params) ->
    rs.$broadcast 'rpc.status', 'waiting'
    if params
      p = [params]
    else
      p = []
    obj =
      Method: method
      Params: p
      Id: randNumber()
    return $http.post(cnfg.API_URL, obj)
])
