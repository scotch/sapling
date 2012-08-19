angular.module('config.services', [])

.factory('config', [
  '$rootScope'

($rootScope) ->
  defaultConfig =
    API_URL: '/-/api/v1'
    AUTH_URL: '/-/auth'
    AUTH_SUCCESS_URL: '/'
    AUTH_ERROR_URL: '/login'
    IMAGE_UPLOAD_URL: '/-/images'

  return defaultConfig
])
