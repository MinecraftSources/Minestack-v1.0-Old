var mongoose = require('mongoose');

var servertypeScheme = mongoose.Schema({

    local: {
        name: { type: [String], index: true },
        plugins: Array
    }

});

module.exports = mongoose.model('servertypes', servertypeScheme);