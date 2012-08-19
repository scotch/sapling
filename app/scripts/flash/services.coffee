serv = {}

serv.flash = [
  'config'
  '$rootScope'

(cnfg, $rootScope) ->

  flashes = []

  Flashes: flashes

  Add: (message, level = 'info') ->
    flash =
      Message: message
      Level: level
    flashes.push(flash)
    $rootScope.$broadcast('flash.add', flash)

  Get: ->
    angular.copy flashes
    flashes = []

  Clear: ->
    flashes = []

  Pop: (position) ->
    $rootScope.$broadcast('flash.remove')
]

angular.module('flash.services', [
  'config.services'
]).factory(serv)
