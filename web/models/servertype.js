var mongoose = require('mongoose');

var servertypeScheme = mongoose.Schema({

    local: {
        name: { type: String, index: true },
        players: Number,
        memory: Number,
        number: Number,
        plugins: Array
    }

});

module.exports = mongoose.model('servertypes', servertypeScheme);