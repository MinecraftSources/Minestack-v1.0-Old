var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var Etcd = require('node-etcd');

var expressJwt = require('express-jwt');

var routes = require('./routes/index');
var login = require('./routes/login');
var setup = require('./routes/setup');
var api = require('./routes/api');

var app = express();

require('./config/passport.js')(passport);

app.locals.mongoose = mongoose;
app.locals.secret = 'thisismysecret';

var etcd = new Etcd('172.17.8.101');
app.locals.etcd = etcd;
if (!process.env.MONGO_URL) {
    console.error('Please set up the MONGO_URL environment variable');
} else {
    mongoose.connect(process.env.MONGO_URL, function (error) {
        if (error) {
            console.error(error);
        }
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: app.locals.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/session', login);

app.use('/api', expressJwt({secret: app.locals.secret}));
app.use('/api', api);


app.use('/', routes);
app.use('/setup', setup);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: "Error",
            errMessage: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: "Error",
        errMessage: err.message,
        error: {}
    });
});


module.exports = app;
