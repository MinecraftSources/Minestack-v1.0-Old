var mongoose = require('mongoose');

var pluginSchema = mongoose.Schema({

    local: {
        name: { type: String, index: true },
        git: String,
        folder: String,
        configs: Array
    }

});

module.exports = mongoose.model('plugins', pluginSchema);