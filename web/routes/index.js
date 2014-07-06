var express = require('express');
var router = express.Router();
var fs = require('fs');
var async = require('async');

router.get('/partials/:file', function (req, res) {
    res.render('partials/'+req.param('file'));
});

router.post('/edittype/:type', function (req, res) {
    res.redirect('/servertypes')
});

router.get('/error', function (req, res) {
    res.render('error', { errMessage: req.flash('errMessage'), error: {} });
});

router.get('*', function (req, res) {
    res.render('index');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/session');
}