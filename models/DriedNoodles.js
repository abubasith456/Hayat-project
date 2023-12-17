var mongoose = require('mongoose');

const driedNoodles = mongoose.Schema({
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

module.exports = mongoose.model('DriedNoodles', driedNoodles);