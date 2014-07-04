var mongoose = require('mongoose');

var pluginSchema = mongoose.Schema({

    local: {
        name: { type: [String], index: true },
        git: String
    }

});

module.exports = mongoose.model('plugins', pluginSchema);