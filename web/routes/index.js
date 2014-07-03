var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');

/* GET home page. */
router.get('/', isLoggedIn,  function(req, res) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function(req, res) {
    res.render('login', { title: 'Login', message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

router.get('/forgot', function(req, res) {
    res.render('forgot', { title: 'Forgot Password', message: req.flash('forgotMessage') });
});

router.post('/forgot', function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            })
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user){
                if (!user) {
                    req.flash('forgotMessage', 'No account with that email address exists');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function(err) {
                    done(err,  token, user);
                })
            })
        },
        function(token, user, done) {
            req.flash('forgotMessage', 'An e-mail has been sent to '+user.local.email+' with further instructions.')
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.param.token,  resetPasswordExpires: { $gt: Date.now() }}, function(err, user) {
        if (!user) {
            req.flash('forgotMessage', 'Password reset token is invalid or has expired');
            return res.redirect('/forgot');
        }
        res.render('reset', { title: 'Reset Password', message: req.flash('resetMessage') })
    })
});

module.exports = router;


function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
}