/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./user/api')
  , session = require('./session/api')
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , mongoose = require('mongoose');

var API_BASE_URL = '/-/api/v1';

express.cookieParser('secret');
var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/../_public');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../_public')));
  // This allows us to render *.html files using res.render('*.html')
  app.engine('html', require('ejs').__express);
});

app.configure('production', function () {
  mongoose.connect(config.ds.production);
});

app.configure('development', function () {
  app.use(express.errorHandler());
  mongoose.connect(config.ds.development);
  var exec = require('child_process').exec;
  exec('node_modules/brunch/bin/brunch watch', function callback(error, stdout, stderr){
     console.log('An error occurred while attempting to start brunch.\n' +
                 'Make sure that it is not running in another window.\n');
   if (error) {
     throw error;

   }
  });
});

app.configure('test', function () {
  mongoose.connect(config.ds.test);
});

// Routes //
app.get('/', function (req, res) {
  res.render('index.html');
});

// auth
//app.get(API_BASE_URL + '/auth/facebook', facebook.start);
//app.get(API_BASE_URL + '/auth/facebook/callback', facebook.callback);
//app.get(API_BASE_URL + '/auth/google', facebook.start);
//app.get(API_BASE_URL + '/auth/google/callback', facebook.callback);

// Users
app.get(API_BASE_URL + '/users', user.list);
app.post(API_BASE_URL + '/users', user.create);
app.get(API_BASE_URL + '/users/me', user.current);
app.get(API_BASE_URL + '/users/:userId', user.read);
app.put(API_BASE_URL + '/users/:userId', user.update);
app.delete(API_BASE_URL + '/users/:userId', user.delete);

// Session
//app.get(API_BASE_URL + '/sessions', session.list);
app.post(API_BASE_URL + '/sessions', session.create);
app.get(API_BASE_URL + '/sessions/me', session.current);
app.put(API_BASE_URL + '/sessions/me', session.update);
//app.get(API_BASE_URL + '/sessions/:sessid', session.read);
//app.put(API_BASE_URL + '/sessions/:sessid', session.update);
//app.delete(API_BASE_URL + '/sessions/:sessid', session.delete);


// Catch all route -- If a request makes it this far, it will be passed to angular.
// This allows for html5mode to be set to true. E.g.
// 1. Request '/signup'
// 2. Not found on server.
// 3. Redirected to '/#/signup'
// 4. Caught by the '/' handler passed to Angular
// 5. Angular will check for '#/signup' against it's routes.
// 6. If found
//  a. Browser supports history api -- change the url to '/signup'.
//  b. Browser does not support history api -- keep the url '/#/signup'
app.use(function (req, res) {
  res.redirect('/#' + req.path);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
