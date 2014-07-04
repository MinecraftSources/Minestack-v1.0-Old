var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('some api');
});

router.get('/servers', function(req, res) {

});

router.get('/servers/:server', function(req, res) {

});

router.get('/players', function(req, res) {

});

router.get('/players/:player', function(req, res) {

});

router.get('/plugins', function(req, res) {

});

router.get('/plugins/:plugin', function(req, res) {

});

router.get('/serverTypes', function(req, res) {

});

router.get('/serverTypes/:serverType', function(req, res) {

});

module.exports = router;
