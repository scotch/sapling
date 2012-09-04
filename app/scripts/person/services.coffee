###
# person.service provides a person object.
#
###
angular.module('person.services', [
  'config.services'
  'rpc.services'
])

.factory('user', [
  'config'
	'$location'
  '$http'
  '$rootScope'
  'rpc'
  'flash'

(cnfg, $location, $http, rs, rpc, flash) ->
  # The Person Object.
  defaultPerson =
    # attributes
    id: ''
    name:
      givenName: ''
      familyName: ''
    email: ''
    emails: []
    gender: ''
    image: ''
    kind: ''
    provider: ''
    url: ''
    urls: []
    tagline: ''

    # methods
    formattedName: ->
      if @name and @name.givenName or @name.familyName
        a = []
        a = a.concat @name.givenName if @name.givenName
        a = a.concat @name.familyName if @name.familyName
        if a.length
         return a.join ' '
      return 'Anonymous User'

  # return

  # New returns a new Person object
  New: (value)->
    angular.copy(value or defaultPerson, @)

])