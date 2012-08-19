angular.module('user.services', [
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

  # The User Object.
  defaultUser =
    # attributes
    id: ''
    name:
      givenName: ''
      familyName: ''
    email: ''
    emails: []
    roles: []
    # methods
    formattedName: ->
      if @name and @name.givenName or @name.familyName
        a = []
        a = a.concat @name.givenName if @name.givenName
        a = a.concat @name.familyName if @name.familyName
        if a.length
         return a.join ' '
      return 'Anonymous User'
    isAuthenticated: ->
      return @id != ''
    isAdmin: ->
      return 'admin' in @roles

  User = (value) ->
    angular.copy(value or defaultUser, @)

  # The Email Object.
  defaultEmail =
    address: ''
    status: ''
    created: ''
    updated: ''

  u = new User()

  emails = []

  # return
  Current: () ->
    if not u.id
      rpc.Run('User.Current', null)
        .success((data, status) ->
          if data.error
            flash.Add data.error
            return
          else
            angular.extend u, data.result.Person
        )
        .error((data, status) ->
        )
    return u

  Logout: (user) ->
    obj =
      Person: user
    u = defaultUser
    rpc.Run('User.Logout', obj)

  Update: (user) ->
    if not user.id
      throw new Error "The user doesn't have an id"
    obj =
      Person: user
    rpc.Run('User.Update', obj)

  Emails: () ->
    rpc.Run('User.Emails', null)
      .success((data, status) ->
        if data.error
          flash.Add data.error
          return
        if data.result.emails
          angular.extend emails, data.result.emails
      )
      .error((data, status) ->
      )
    return emails
])
