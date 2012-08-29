angular.module('auth.password.services', [
  'rpc.services'
])

.factory('password', [
  'rpc'

(rpc) ->

  defaultPassword =
    email: ''
    new: ''
    current: ''
    isSet: ''

  Password = (value) ->
    angular.copy(value or defaultPassword, @)

  p = new Password()

  # return
  Current: ->
    rpc.Run('Password.Current', null)
      .success((data, status) ->
        if data.error
          flash.Add data.error
          return
        angular.extend p, data.result.Password
      )
      .error((data, status) ->
      )
    return p

  Login: (email, pass) ->
    obj =
      password:
        current: pass
        email: email
      person:
        email: email
    rpc.Run('Password.Authenticate', obj)

  Create: (email, pass, person) ->
    obj =
      password:
        new: pass
        email: email
      person: person
    rpc.Run('Password.Authenticate', obj)

  Update: (email, currentPass, newPass, person) ->
    obj =
      password:
        current: currentPassword
        new: newPassword
        email: email
      person: person
    rpc.Run('Password.Authenticate', obj)
])
