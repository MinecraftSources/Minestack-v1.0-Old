var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', checkSetup, isLoggedIn, function (req, res) {
    res.render('index', { title: 'Home', errMessage: req.flash('errMessage') });
});

router.get('/error', isLoggedIn, function (req, res) {
    res.render('error', { title: 'Error', errMessage: req.flash('errMessage') });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function checkSetup(req, res, next) {
    var file = './config.json';
    fs.readFile(file, 'utf8', function(err, data){
        if (err) {
            req.flash('errMessage', 'MN Squared is not setup')
            res.redirect('/setup')
            return;
        }
        return next();
    });
}