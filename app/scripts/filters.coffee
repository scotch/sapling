angular.module('app.filters', [])

.filter('interpolate', [
  'version',

(version) ->
  (text) ->
    String(text).replace(/\%VERSION\%/mg, version)
])

.filter('iconify', [ ->
  (text) ->
    '//s2.googleusercontent.com/s2/favicons?domain=' + text
])
