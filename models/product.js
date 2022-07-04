var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        //  required: true
    },
    description: {
        type: String,
        // required: true
    },
    productImage: {
        type: String,
        //  required: true 
    },
    isLiked: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Product', productSchema);