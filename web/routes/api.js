var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('some api');
});

module.exports = router;
