var mongoose = require('mongoose');

const groceryScheme = mongoose.Schema({
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
    groceryImage: {
        type: String,
    },
    isLiked: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Grocery', groceryScheme);