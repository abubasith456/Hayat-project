const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const featureProductsScema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: [3, "Too Short product Name"],
        },
        images: {
            type: [String],
        },
        description: {
            type: String,
            maxlength: [100, "Description should be less than or equal to 100"],
            minlength: [10, "Description should be more than or equal to 10"],
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            default: 0,
            min: 0,
            required: true,
        },
        priceAfterDiscount: {
            type: Number,
            default: 0,
            min: 0,
        },
        quantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        sold: {
            type: Number,
            default: 0,
            min: 0,
        },
        category: {
            type: Schema.ObjectId,
            ref: "Category",
        },
        ratingAvg: {
            type: Number,
            min: 1,
            max: 5,
        },
        ratingCount: {
            type: Number,
            min: 0,
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

module.exports = mongoose.model('featureProducts', featureProductsScema);