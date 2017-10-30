var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var validator = require('express-validator');

var productRouter = require('./routers/productRouter');
var userRouter = require('./routers/userRouter');
var authRouter = require('./routers/authRouter');

var app = express();

require('./config/passport');

/**
 * view engine setup
 */
app.set("view engine", "ejs");


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'doubleDimensionKey',
    resave: false,
    saveUninitialized: false ,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 10 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

/**
 * app locals
 */
app.use(function (req, res, next) {
    res.locals.title = 'Shop';
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

/**
 * Define routes
 */
app.get('/', function (req, res) {
    res.redirect('/home');
});

app.use('/home', productRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

app.get('*', function (req, res, next) {
  next();
});

/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
