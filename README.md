# sapling
### AngularJS Starter App Providing User Management

***CAUTION: Sapling is in the very early stages of development. Things are likely
to change in ways that are not backwards compatible***

[AngularJS](http://angularjs.org) + [Brunch](http://brunch.io)

Client Features:
* User Account management
* User login
* User signup
* Coffeescript / Less / Sass / SCSS / Stylus automatically compiled on save
* auto-reload during development saves you from manually refreshing the page
* Javascript / CSS minification for production
* [testacular](https://github.com/vojtajina/testacular) integration for unit tests
* Bootstrap integration with themes.

## Usage

Sapling is intended to be used with a backend, but comes with a basic NodeJS / Express server to get your started.
*Please visit the `backend` section for a complete list of backends.*

* `git clone https://github.com/scotch/sapling.git` to clone the **sapling** repository
* `cd sapling`
* `./scripts/init.sh` to install node packages
* `./scripts/development.sh` to compile javascript and css

### Development

#### Starting Sapling (client)

* `./scripts/development.sh` to start **Brunch** compiling
*Note: in the future this step will be removed*

#### Starting Express (server)

*`npm start`
Then navigate your browser to [http://localhost:3000](http://localhost:3000)

#### Testing

* `./scripts/test.sh` to run unit test with [testacular](https://github.com/vojtajina/testacular)
* Open the browser you would like to test to [http://localhost:3334](http://localhost:3334)

Notes:

- If you would like to write your test in coffeescript run `./scripts/compile-tests.sh` in a separate window.
- Testacular will run tests on save. To insure that changes are saved be sure to have ``./script/development.sh` running in the console.
- To changed the target browsers modify your `/test/conf.js` file E.g. `browser = ["ChromeCanary", "Firefox"]`

##### End to end testing

WIP

### Production

* `./scripts/production.sh` to minify javascript and css files for production use.

### FAQ

### Common issues

`EMFILE` error
- EMFILE means there're too many open files. Brunch watches all your project files and it's usually a pretty big number. You can fix this error with setting max opened file count to bigger number with command ulimit -n <number> (ulimit -n 10000 should be enough).

## Backends

[sapling-aego](https://github.com/scotch/sapling-aego)

## Receiving updates from upstream

When we upgrade sapling's repo, you can just fetch the changes and merge them into your project with git.

`git pull origin master`

## Directory Layout

    _public/                  --> Contains generated file for severing the app
                                  These files should not be edited directly
    app/                      --> all of the files to be used in production
      scripts/                --> base directory for app scripts
        controllers.js        --> application controllers
        directives.js         --> custom angular directives
        filters.js            --> custom angular filters
        services.js           --> custom angular services
      assets                  --> a place for static assets. These files will be copied to
                                  the public directory un-modified.
        font/                 --> [fontawesome](http://fortawesome.github.com/Font-Awesome/) rendering icons
          fontawesome-webfont.*
        img/                  --> image files
        partials/             --> angular view partials (partial html templates)
          nav.html
          partial1.html
          partial2.html
        index.html            --> app layout file (the main html template file of the app)

      styles/                 --> all custom styles. Acceptable files types inculde:
                                  less, sass, scss and stylus
        themes/               --> a place for custom themes
          custom/             --> starter theme **NOTE the underscore (_). Files begining with an
                                  underscore will not automatically be compiled, they must be imported.
            _override.less    --> styles that should beloaded after bootstrap.
            _variables.less   --> bootstrap variables to be used during the compilation process
        app.less              --> a file for importing styles.
      app.coffee              --> application definition and routes.
      init.coffee             --> application bootstrap

    node_modules              --> NodeJS modules

    scripts/                  --> handy shell scripts
      compile-tests.sh        --> compiles coffeescript test to javascript
      development.sh          --> compiles files and watches for changes
      init.sh                 --> installs node modules
      production.sh           --> compiles and compresses files for production use
      server.sh               --> runs a development server at `http://localhost:3333`
      test.sh                 --> runs all unit tests
    server/                   --> this directory contains the Express server. If you are using your own backend you
                                  may safely delete this directory.
      **DETAILS** Coming Soon!
    test/                     --> test source files and libraries
      e2e/                    -->
        scenarios.js          --> end-to-end specs **NOT WORKING YET**
      unit/
        controllers.spec.js   --> specs for controllers
        directives.spec.js    --> specs for directives
        filters.spec.js       --> specs for filters
        services.spec.js      --> specs for services
      vendor/
        angular/              --> angular testing libraries
          angular-mocks.js    --> mocks that replace certain angular services in tests

    vendor/
      scripts/                --> angular and 3rd party javascript libraries
        angular/                  files are compiled to `vendor.js`
          angular.js          --> the latest angular js
          angular-*.js        --> angular add-on modules
          version.txt         --> version number
        bootstrap/            --> for responsive layout
          bootstrap-collapse.js
        console-helper.js     --> makes it safe to do `console.log()` always
        jquery-1.7.2.js       --> for use with bootstrap-collapse
      styles/                 --> sapling / sapling themes and 3 party CSS
        bootstrap/            --> boostrap files - **NOTE** the underscore prevents the
          _*.less                 files from automatically being added to application.css
        sapling               --> extends boostrap
          _*.less
        themes                --> themes to extend Bootstrap
          default             --> the default bootstrap theme
            _overrides.less
            _variables.less
          sapling             --> supplemental theme
            _overrides.less
            _variables.less
          smokey              --> supplemental theme
            _overrides.less
            _variables.less

## Contact

For more information on sapling please check out http://sapling.scotchmedia.com/
