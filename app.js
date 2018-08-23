// Get the api keys into env variables
require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/passport.js');
var session = require("express-session");

// Directions for our routers
var indexRouter = require('./routes/index-routes.js');
var usersRouter = require('./routes/user_details-api-routes.js');
// var authRouter = require('./routes/auth-routes.js');

// Run the function that gets new popular tweets at a scheduled time (every 12 hours).
require("./tasks/getPopularIBM")();

var indexRouter = require('./routes/index-routes');
var app = express();

// Sequelize db
var db = require("./models");

var PORT = process.env.PORT || 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
require('./routes/auth-routes.js')(app);
require('./routes/user_details-api-routes.js')(app);
require('./routes/passport-api-routes.js')(app);
require('./routes/handles-api-routes.js')(app);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Start up the app and sequelize
// db.sequelize.sync({ force: true }).then(function () {
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
});

module.exports = app;
