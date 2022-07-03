var mongoose = require('mongoose');

const drinksScheme = mongoose.Schema({
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
    drinksImage: {
        type: String,
    },
});

module.exports = mongoose.model('Drinks', drinksScheme);