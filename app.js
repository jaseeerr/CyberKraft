require('dotenv').config({path: './.env'});
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nocache = require("nocache");
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
const session = require('express-session');
//mongoose
require('./config/dbconfig')



var app = express();

// NOCACHE
app.use(nocache());
// view engine setup
app.set('view engine','ejs'); 

app.engine('ejs', require('ejs').__express);
//session
app.use(session({ secret: 'key',resave:false,saveUninitialized:false, cookie: { maxAge: 6000000 } }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err.status);
  res.render('error');
  // res.status(err.status || 500);
  
});

module.exports = app;
