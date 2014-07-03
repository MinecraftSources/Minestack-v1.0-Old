var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var User = require('../models/user');
var fs = require('fs');

router.get('/', checkSetup, function (req, res) {
    res.render('setupMongo', { title: 'Mongo Setup', errMessage: req.flash('errMessage') });
});

router.post('/', checkSetup, function (req, res) {
    async.waterfall([
        function (done) {
            var address = req.body.address;
            var port = req.body.port;
            var username = req.body.username;
            var password = req.body.password;
            var mongoURL;
            if (port.length > 0) {
                address = address+':'+port;
            }
            if (username.length > 0) {
                mongoURL = 'mongodb://'+username+':'+password+'@' + address + '/mn2';
            } else {
                mongoURL = 'mongodb://' + address + '/mn2';
            }
            mongoose.connect(mongoURL, function (err) {
                if (err) {
                    req.flash('errMessage', err.message);
                    return res.redirect('/setup');
                }
                done(err);
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/setup/admin');
    })
});

router.get('/admin', checkSetup, checkMongo, function (req, res) {
    res.render('setupAdmin', { title: 'Admin Setup', errMessage: req.flash('errMessage') });
});

router.post('/admin', checkSetup, checkMongo, function(req, res) {
    async.waterfall([
        function (done) {
            var newUser = new User();
            // set the user's local credentials
            newUser.local.email = req.body.email;
            if (req.body.password != req.body.password) {
                req.flash('errMessage', 'Passwords must be the same');
                return res.redirect('/admin');
            }
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/setup/admin');
    });
});

module.exports = router;

function checkMongo(req, res, next) {
    mongoose.connection.on('open', function(ref) {
        return next();
    });
    req.flash('errMessage', 'MongoDB has not been setup yet');
    res.redirect('/setup');

}

function checkSetup(req, res, next) {
    var file = './config.json';
    fs.readFile(file, 'utf8', function(err, data){
       if (err) {
           return next();
           return;
       }
       req.flash('errMessage', 'MN Squared is already setup')
       res.redirect('/')
    });
}