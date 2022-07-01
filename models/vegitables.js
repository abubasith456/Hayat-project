var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const vegetablesSchema = mongoose.Schema({
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
    vegetableImage: {
        type: String,
    },
});

module.exports = mongoose.model('Vegetables', vegetablesSchema);