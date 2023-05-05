var mongoose = require('mongoose');

const bannerScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    percentage: {
        type: String,
    },
    products: [
        {
            productId: {
                type: String,
            },
            productName: {
                type: String,
            },
            productImage: {
                type: String,
            },
            price: {
                type: String,
            },
        },
    ],
});

module.exports = mongoose.model('Banner', bannerScheme);