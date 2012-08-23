ErrServer = 'A Sever Error occured. Please try again.'
ErrEmailInUse = 'Email address in use. Try <a href="/login">Logging in</a>'
ErrInvalidAddress = 'Account not found for email address. Try <a href="/signup">Create Account</a>'
ErrPasswordLength = 'Password must be between 4 -32 characters'

errors =
  'email: invalid address': ErrInvalidAddress
  'password: profile not found for email address': ErrInvalidAddress
  'password: invalid password': ErrPasswordLength
  'email: in use': ErrEmailInUse

angular.module('account.controllers', [
  'config.services'
  'flash.services'
  'user.services'
])

.controller('AccountCtrl', [
  '$scope'
  'config'
  'user'
  'password'
  '$timeout'

($scope, cnfg, user, password, $timeout) ->

  $scope.$on 'rpc.status', (e, d) ->
    if d == 'waiting'
      $scope.WaitText = 'Working...'
    else
      $scope.WaitText = false

  $scope.User = user.Current()

  $scope.Password = ''

  # Globals
  $scope.Providers = [
    {name: 'google+',    url: cnfg.AUTH_URL+'/google'}
    {name: 'facebook',  url: cnfg.AUTH_URL+'/facebook'}
    {name: 'twitter',   url: cnfg.AUTH_URL+'/twitter'}
    {name: 'linkedin',  url: cnfg.AUTH_URL+'/linkedin'}
    {name: 'yahoo',     url: cnfg.AUTH_URL+'/appengine_openid?provider=yahoo.com'}
    {name: 'google',    url: cnfg.AUTH_URL+'/appengine_openid?provider=gmail.com'}
    {name: 'github',    url: cnfg.AUTH_URL+'/github'}
    {name: 'myspace',   url: cnfg.AUTH_URL+'/appengine_openid?provider=yahoo.com'}
  ]

  # Functions
  $scope.Authenticate = (provider, w = 400, h = 350) ->
    url = provider.url
    left = (screen.width/2)-(w/2)
    top = (screen.height/2)-(h/2)
    targetWin = window.open(url, 'authWindow', 'toolbar=no, location=1, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)
    checkIt = ->
      p = targetWin.location.pathname
      if p == cnfg.AUTH_SUCCESS_URL
        targetWin.close()
        $scope.User = user.Current()
      else if p == cnfg.AUTH_ERROR_URL
        targetWin.close()
        $scope.ErrMsgs.push 'An error occured please try again.'
      else
        $timeout(checkIt, 1000)
    checkIt()


  $scope.Logout = (u) ->
    user.Logout(u)
      .success((data, status) ->
        if data.result.Error
          if data.result.Error.Code == 0
            $scope.ErrMsgs.push ErrServer
      )
      .error((data, status) ->
        $scope.ErrMsgs.push ErrServer
      )

])

.controller('AccountLoginCtrl', [
  '$scope'
  'config'
  'user'
  '$timeout'
  'flash'
  'password'

($scope, cnfg, user, $timeout, flash, password) ->

  $scope.FormErrors = false
  $scope.ErrMsgs = []

  $scope.Login = (u, pass) ->
    password.Login(u.email, pass)
      .success((data, status) ->
        r = data.result
        if data.error
          $scope.FormErrors = true
          $scope.ErrMsgs.push errors[data.error] or ErrServer
      )
      .error((data, status) ->
        $scope.ErrMsgs.push ErrServer
      )

])

.controller('AccountSignupCtrl', [
  '$scope'
  'user'
  'flash'
  'password'

($scope, user, flash, password) ->

  $scope.FormErrors = false
  $scope.ErrMsgs = []

  $scope.CreateAccount = (u, pass) ->
    password.Create(u.email, pass, u)
      .success((data, status) ->
        $scope.User = data.result.Person
        if data.error
          $scope.FormErrors = true
          $scope.ErrMsgs.push errors[data.error] or ErrServer
      )
      .error((data, status) ->
        $scope.ErrMsgs.push ErrServer
      )
])

.controller('AccountRecoveryCtrl', [
  '$scope'

($scope) ->

])

.controller('AccountOverviewCtrl', [
  '$scope'

($scope) ->

])

.controller('AccountPasswordCtrl', [
  '$scope'
  'user'
  'password'

($scope, user, password) ->
  $scope.FormErrors = false
  $scope.ErrMsgs = []

  $scope.Password = password.Current()

  $scope.UpdatePassword = (email, passCurrent, u) ->
    password.Update(u.email, u.password.current, u.password.new)
])

.controller('AccountConnectedCtrl', [
  '$scope'
  'authProfile'

($scope, ap) ->

  $scope.AuthProfiles = ap.All()

])

.controller('AccountEmailCtrl', [
  '$scope'
  'user'

($scope, user) ->

  $scope.Emails = user.Emails()

])

.controller('AccountProfileCtrl', [
  '$scope'
  'user'

($scope, user) ->
  $scope.FormErrors = false
  $scope.ErrMsgs = []

  $scope.UpdateUser = (u) ->
    user.Update(u)
      .success((data, status) ->
        r = data.result
        handleError($scope, data.error) if data.error
      )
      .error((data, status) ->
        handleError($scope, status)
      )
])
