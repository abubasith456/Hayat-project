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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        // required: false,
    },
    productImage: {
        type: String,
        //  required: true 
    },
    rating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);