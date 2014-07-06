var express = require('express');
var router = express.Router();
var fs = require('fs');
var ServerType = require('../models/servertype');
var Plugin = require('../models/plugin');
var async = require('async');

router.get('/partials/:file', function (req, res) {
    console.log(req.param('file'));
    res.render('partials/'+req.param('file'), {errMessage: req.flash('errMessage'), successMessage: req.flash('successMessage')});
});

router.post('/edittype/:type', function (req, res) {
    console.log('posted');
    req.flash('successMessage', 'Edited '+req.param('type'));
    res.redirect('/servertypes')
});

router.get('*', function (req, res) {
    res.render('index', { title: 'Overview', errMessage: req.flash('errMessage'), successMessage: req.flash('successMessage') });
});

/*router.get('/', isLoggedIn, function (req, res) {
    res.render('index', { title: 'Overview', errMessage: req.flash('errMessage'), successMessage: req.flash('successMessage') });
});

router.get('/servertypes', isLoggedIn, function (req, res) {
    res.render('servertypes', { title: 'Server Types', errMessage: req.flash('errMessage'), successMessage: req.flash('successMessage') });
});

router.post('/servertypes', isLoggedIn, function (req, res) {
    res.redirect('/edittype/'+req.body.id);
});

router.get('/edittype/:token', isLoggedIn, function (req, res) {
    var type = req.param('token');
    var options = {};
    options.title = 'Edit Server Type';
    options.errMessage = req.flash('errMessage');
    options.successMessage = req.flash('successMessage');
    options.type = {};
    options.type.id = type;

    ServerType.findOne({ _id: type }, function(error, servertype){
        if (error) {
            req.flash('errMessage', 'Unable to load server '+type);
            res.redirect('/servertypes');
            return;
        }
        options.type.name = servertype.local.name;
        options.type.players = servertype.local.players;
        options.type.memory = servertype.local.memory;
        res.render('edittype', options);
    });
});

router.post('/edittype/:token', isLoggedIn, function(req, res){
    ServerType.findOne({ _id: req.body.id }, function(error, servertype){
        if (error) {
            req.flash('errMessage', 'Unable to load server '+req.body.id);
            res.redirect('/servertypes');
            return;
        }
        servertype.local.name = req.body.name;
        servertype.local.players = req.body.players;
        servertype.local.memory = req.body.memory;

        servertype.save(function(error){
            if (error) {
                req.flash('errMessage', 'Unable to save server '+req.body.id);
                res.redirect('/servertypes');
                return;
            }
            req.flash('successMessage', 'Successfully edited server type '+req.body.id);
            res.redirect('/servertypes');
        });
    });
});

router.get('/error', function (req, res) {
    res.render('error', { title: 'Error', errMessage: req.flash('errMessage'), error: {} });
});*/

module.exports = router;

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
}