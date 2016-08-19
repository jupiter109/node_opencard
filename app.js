var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var qiniu = require('./routes/qiniu');
var list = require('./routes/list');
var ocr = require('./routes/ocr');
var camcard = require('./routes/camcard');
var authentication = require('./routes/authentication');
var failure = require('./routes/failure');
var success = require('./routes/success');
var expressSession = require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookic: {secret: true}
});

//mongoDB config
var mongoose = require('./lib/mongoose');
var dao = require('./lib/dao')(mongoose);
global.dao = dao;
var User = dao.User;

//passportLocal
var passport = require('./lib/passportLocal');

//app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/', routes);
app.use('/list', list);
app.use('/qiniu', qiniu);
app.use('/ocr', ocr);
app.use('/camcard', camcard);
app.use('/authentication', authentication);
app.use('/failure', failure);
app.use('/success', success);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
