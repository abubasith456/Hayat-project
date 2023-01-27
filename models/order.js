const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        unique_id: { type: Number, required: true },
        numOfItems: { type: Number, required: true },
        user_id: { type: Number, required: true },
        user_name: { type: String, required: true },
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
                    //  required: true 
                },
                quantity: {
                    type: String,
                },
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "Packing" },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);