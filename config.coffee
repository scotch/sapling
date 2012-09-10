exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  modules:
    definition: false
    wrapper: (path, data) ->
      """
(function() {
  #{data}
}).call(this);\n\n
      """
  paths:
    public: '_public'
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        before: [
          'vendor/scripts/angular/angular.js'
          'vendor/scripts/angular/angular-resource.js'
          'vendor/scripts/angular/angular-cookies.js'
        ]

    stylesheets:
      joinTo:
        'css/app.css': /^(app|vendor)/

  # Enable or disable minifying of result js / css files.
  # minify: true
