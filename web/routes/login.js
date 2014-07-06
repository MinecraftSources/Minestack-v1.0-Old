var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');
var jwt = require('jsonwebtoken');

router.get('*', function (req, res) {
    res.render('index');
});

router.post('/', function(req, res, next){
    passport.authenticate('local-login', function (error, user, info){
        var resp = {
            errorCode: 0,
            error: '',
            token: ''
        };
        if (error) {
            resp.errorCode = 1;
            resp.error = 'Database Error';
        }
        if (!user) {
            resp.errorCode = 2;
            resp.error = 'Invalid Email or Password';
        }
        if (resp.errorCode == 0) {
            resp.token = jwt.sign({ email: user.local.email }, 'thisismysecret', { expiresInMinutes: 1/*60*5*/ });
            res.send(resp);
        } else {
            res.send(401, resp);
        }
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    console.log('logout');
    req.logout();
    res.redirect('/session');
});

/*router.get('/forgot', function (req, res) {
    res.render('forgot', { title: 'Forgot Password', errMessage: req.flash('errMessage') });
});*/

router.post('/forgot', function (req, res) {
    async.waterfall([
        function (done) {
            var resp = {
                errorCode: 0,
                error: '',
                token: ''
            };
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, resp, token);
            })
        },
        function (resp, token, done) {
            User.findOne({ 'local.email': req.body.email }, function (err, user) {
                if (!user) {
                    resp.errorCode = 1;
                    resp.error = 'No user with the email of '+req.body.email;
                    done(err, resp, token);
                    return;
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function (err) {
                    done(err, resp);
                })
            })
        }
    ], function (err, resp) {
        if (resp.errorCode == 0) {
            res.send(resp);
        } else {
            res.send(401, resp);
        }
    });
});

/*router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.param("token"), resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
        if (!user) {
            req.flash('errMessage', 'Password reset token is invalid or has expired');
            return res.redirect('/login/forgot');
        }
        res.render('reset', { title: 'Reset Password', message: req.flash('resetMessage') })
    })
});*/

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