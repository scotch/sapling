// Sample Testacular configuration file, that contain pretty much all the available options
// It's used for running client tests on Travis (http://travis-ci.org/#!/vojtajina/testacular)
// Most of the options can be overriden by cli arguments (see testacular --help)



// base path, that will be used to resolve files and exclude
basePath = '../'

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,

  // Javascript //
  'vendor/scripts/angular/angular.js',
  'vendor/scripts/**/*.js',
  'app/scripts/**/*.js',

  // CoffeeScript //
  // When using coffeescript you must run `./scripts/development.sh` in the background
  // to compile the .coffee file to .js. Uncomment these lines to used the generated file.
  // '_public/js/vendor.js',
  // '_public/js/app.js',

  'test/vendor/angular/angular-mocks.js',

  // Sapling mocks
  // 'test/vendor/sapling/sapling-mocks.js',

  // Specs
  'test/unit/**/*.spec.js'
];

// list of files to exclude
exclude = [];

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots' || 'progress'
reporter = 'progress';

// web server port
port = 3334;

// cli runner port
runnerPort = 3335;

// enable / disable colors in the output (reporters and logs)
colors: true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;
//logLevel = LOG_DEBUG;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// polling interval in ms (ignored on OS that support inotify)
autoWatchInterval: 0;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = ['Chrome'];

// Auto run tests on start (when browsers are captured) and exit
singleRun = false;
