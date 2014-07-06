var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');

router.get('/', function (req, res) {
    res.render('login', { title: 'Login', errMessage: req.flash('errMessage'), successMessage: req.flash('successMessage') });
});

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/forgot', function (req, res) {
    res.render('forgot', { title: 'Forgot Password', errMessage: req.flash('errMessage') });
});

router.post('/forgot', function (req, res) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            })
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash('errMessage', 'No account with that email address exists');
                    return res.redirect('/login/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function (err) {
                    done(err, token, user);
                })
            })
        },
        function (token, user, done) {
            req.flash('errMessage', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.')
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/login/forgot');
    });
});

router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.param("token"), resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
        if (!user) {
            req.flash('errMessage', 'Password reset token is invalid or has expired');
            return res.redirect('/login/forgot');
        }
        res.render('reset', { title: 'Reset Password', message: req.flash('resetMessage') })
    })
});

router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.param.token, resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
                if (!user) {
                    req.flash('errMessage', 'Password reset token is invalid or has expired');
                    return res.redirect('/login/forgot');
                }

                if (req.body.password != req.body.confirm) {
                    req.flash('errMessage', 'Both passwords must match.');
                    return res.redirect('/login/reset'+req.param.token);
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                    done(err, user);
                })
            })
        },
        function(user, done) {
            req.flash('errMessage', 'Success! Your password has been changed.');
            done(err);
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/');
    })
});

module.exports = router;