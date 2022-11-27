const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        unique_id: { type: Number, required: true },
        numOfItems: { type: Number, required: true },
        products: [
            {
                productId: {
                    type: String,
                },
                productName: {
                    type: String,
                },
                quantity: {
                    type: Number,
                },
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);