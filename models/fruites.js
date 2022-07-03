var mongoose = require('mongoose');

const fruitsScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    fruiteImage: {
        type: String,
    },
});

module.exports = mongoose.model('Fruites', fruitsScheme);