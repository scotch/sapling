angular.module('auth.profile.services', [
  'rpc.services'
])

.factory('authProfile', [
  'rpc'

(rpc) ->

  # The AuthProfile Object.
  defaultAuthProfile =
    # attributes
    id: ''
    name:
      givenName: ''
      familyName: ''
    provider: ''
    url: ''
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

  profiles = []

  # return
  All: () ->
    rpc.Run('AuthProfile.GetAll', null)
      .success((data, status) ->
        if data.error
          flash.Add data.error
          return
        if data.result.Profiles
          angular.extend profiles, data.result.Profiles
      )
      .error((data, status) ->
      )
    return profiles

  GetAll: () ->
    rpc.Run('AuthProfile.GetAll', null)
        .success((data, status) ->
          if data.error
            flash.Add data.error
            return
          else
            angular.extend u, data.result.Person
        )
        .error((data, status) ->
        )
])
