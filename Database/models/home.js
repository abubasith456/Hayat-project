
const { Schema, model } = require("mongoose");
import bannerSchema from '../models/banner'
import productSchema from '../models/product'
import categorySchema from '../models/category'

const homeSchema = new Schema({
    banners: [bannerSchema],
    categories: [categorySchema],
    recentPurchase: [],
    newProducts: [productSchema]
});

module.exports = model('Home', homeSchema);