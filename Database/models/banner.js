var mongoose = require('mongoose');

const bannerScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    percentage: {
        type: String,
    },
    image: {
        type: String
    },
    products: [
        {
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
        },
    ],
});

module.exports = mongoose.model('Banner', bannerScheme);