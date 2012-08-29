###
# user.services provides services for interating with users
###

angular.module('user.services', [
  'config.services'
  'rpc.services'
])

.factory('user', [
  'config'
	'$location'
  '$http'
  '$rootScope'
  '$route'
  'rpc'
  'flash'

(cnfg, $location, $http, $rootScope, $route, rpc, flash) ->

  ###
  # User
  ###

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

  ###
  # Email
  ###

  # The Email Object.
  defaultEmail =
    address: ''
    status: ''
    created: ''
    updated: ''

  u = new User()

  ###
  # Code taken from https://groups.google.com/forum/?fromgroups=#!starred/angular/POXLTi_JUgg
  # By Adam Wynne
  ###

  $rootScope.$on "$routeChangeSuccess", (current) ->
    authRequired = $route.current and $route.current.$route and $route.current.$route.auth
    if authRequired and not u.isAuthenticated()
      #growl.info "Authentication error", "You need to be signed in to view that page.<br/><br/>" + "Please sign in and we'll have you viewing that page in a jiffy"
      currentUrl = $location.url()
      redirectUrl = cnfg.AUTH_LOGIN_URL + '?next=' + encodeURIComponent(currentUrl)
      $location.url(redirectUrl)

  emails = []

  status =
    0: 'unverified'
    1: 'pending'
    2: 'verified'
    3: 'primary'

  # return
  Status : (code) ->
    return status[code]

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
