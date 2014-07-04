var express = require('express');
var router = express.Router();
var async = require('async');
var User = require('../models/user');
var fs = require('fs');
var querystring = require('querystring');

router.get('/', function (req, res) {
    res.render('setupAdmin', { title: 'Admin Setup', errMessage: req.flash('errMessage') });
});

router.post('/', function(req, res) {
    async.waterfall([
        function (done) {
          User.count({}, function (err, count) {
              if (count != 0) {
                  req.flash('errMessage', 'Admin Account Already Exists');
                  return res.redirect('/');
              } else {
                  done(err)
              }
          })
        },
        function (done) {
            var newUser = new User();
            newUser.local.email = req.body.email;
            if (req.body.password != req.body.confirm) {
                req.flash('errMessage', 'Passwords must be the same');
                return res.redirect('/setup');
            }
            newUser.local.password = newUser.generateHash(req.body.password);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
    ], function (err) {
        if (err) return next(err);
        req.flash('successMessage', 'Admin account created');
        res.redirect('/');
    });
});

module.exports = router;