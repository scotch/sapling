/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./user/api')
  , session = require('./session/api')
  , fs = require('fs')
  , http = require('http')
  , path = require('path');

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
  app.engine('html', require('ejs').__express);
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.cookie('name', 'tobi', {  path: '/' });
  res.render('index.html');
});

app.get('/users', user.list);

app.get('/-/api/v1/session', session.list);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
