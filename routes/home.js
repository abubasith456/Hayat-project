const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const DriedNoodles = require("../models/DriedNoodles")
const { responseAddProduct, responseFetchProduct } = require("../utils/responseModel");
const Banner = require("../models/banner")
const Category = require("../models/category")
const Order = require("../models/order");
const Products = require("../models/product");

router.get("/", async (req, res, next) => {
    try {
        const bannersList = await Banner.find();
        const categoryList = await Category.find();
        const ordersList = {}
        try {
            ordersList = await Order.find({ unique_id: req.params.id });
        } catch (err) {
            console.log(err)
        }
        const productsList = await Products.find();

        const response = {
            banner: bannersList,
            categories: categoryList,
            recentPurchase: ordersList,
            products: productsList
        }

        res.status(200).send(responseFetchProduct(true, response))

    } catch (e) {
        res.status(500).send(responseFetchProduct(false, e))
    }
});


// router.get("/:id", async (req, res) => {
//     try {
//         const bannersList = await Banner.find();
//         const categoryList = await Category.find();
//         const ordersList = {}
//         try {
//             ordersList = await Order.find({ unique_id: req.params.id });
//         } catch (err) {
//             console.log(err)
//         }
//         const productsList = await Products.find();

//         const response = {
//             banner: bannersList,
//             categories: categoryList,
//             recentPurchase: ordersList,
//             products: productsList
//         }

//         res.status(200).send(responseFetchProduct(true, response))

//     } catch (e) {
//         res.status(500).send(responseFetchProduct(false, e))
//     }

// });

module.exports = router;