var mongoose = require('mongoose');

const babyItems = mongoose.Schema({
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
    image: {
        type: String,
    },
    isLiked: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('BabyItems', babyItems);