var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', isLoggedIn, function (req, res) {
    res.render('index', { title: 'Home', errMessage: req.flash('errMessage'), successMessage: req.flash('successMessage') });
});

router.get('/error', function (req, res) {
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