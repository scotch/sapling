'use strict';

var express = require('express');
var user = require('./user/api');
var session = require('./session/api');
var fs = require('fs');
var http = require('http');
var path = require('path');
var config = require('./config');
var mongoose = require('mongoose');
var SessionMongoose = require('session-mongoose');
var passport = require('passport');
var auth = require('./auth/routes');
// Strategies
var passwordRoutes = require('./auth/password/routes');
var passwordApi = require('./auth/password/api');
//var FacebookStrategy = require('passport-facebook').Strategy;

var API_BASE_URL = '/-/api/v1';
var AUTH_URL = '/-/auth';


express.cookieParser('secret');
var app = exports.app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/../_public');
  app.set('view engine', 'ejs');
  app.set('dbUrl', config.db[app.settings.env]);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, '../_public')));
  // Render *.html files using ejs
  app.engine('html', require('ejs').__express);

});

app.configure('production', function () {
  app.use(express.session({
    store: new SessionMongoose({
      url: app.get('dbUrl')
    })
  }));
  mongoose.connect(app.get('dbUrl'));
});

app.configure('development', function () {
  mongoose.connect(app.get('dbUrl'));
  app.use(express.errorHandler());
  var exec = require('child_process').exec;
  exec('node_modules/brunch/bin/brunch watch', function callback(error, stdout, stderr) {
    if (error) {
      console.log('An error occurred while attempting to start brunch.\n' +
                  'Make sure that it is not running in another window.\n');
      throw error;
    }
  });
});

app.configure('test', function () {
  var opts = { server: { auto_reconnect: false } };
  mongoose.connect(app.get('dbUrl'), opts);
});

// Routes //
app.get('/', function (req, res) {
  res.render('index.html');
});

// auth
app.get(AUTH_URL + '/logout', auth.logout);
app.post(AUTH_URL + '/password', passwordRoutes.list);
//app.get(API_BASE_URL + '/auth/facebook/callback', facebook.callback);
//app.get(API_BASE_URL + '/auth/google', facebook.start);
//app.get(API_BASE_URL + '/auth/google/callback', facebook.callback);

// API
app.get(API_BASE_URL + '/auth/password', passwordApi.list);
app.post(API_BASE_URL + '/auth/password', passwordApi.create);

app.get(API_BASE_URL + '/users', user.list);
app.post(API_BASE_URL + '/users', user.create);
app.get(API_BASE_URL + '/users/me', user.current);
app.get(API_BASE_URL + '/users/:userId', user.read);
app.put(API_BASE_URL + '/users/:userId', user.update);
app.delete(API_BASE_URL + '/users/:userId', user.delete);

// Catch all route -- If a request makes it this far, it will be passed to angular.
// This allows for html5mode to be set to true. E.g.
// 1. Request '/signup'
// 2. Not found on server.
// 3. Redirected to '/#/signup'
// 4. Caught by the '/' handler passed to Angular
// 5. Angular will check for '#/signup' against it's routes.
// 6. If found
//    a. Browser supports history api -- change the url to '/signup'.
//    b. Browser does not support history api -- keep the url '/#/signup'
app.use(function (req, res) {
  res.redirect('/#' + req.path);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
