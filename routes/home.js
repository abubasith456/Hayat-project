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
const User = require("../models/user");

router.get("/", async (req, res, next) => {
    try {
        const userId = req.query.id;
        console.log("UserId -> ", userId);
        const bannersList = await Banner.find();
        const categoryList = await Category.find();
        let userData = {}
        let ordersList = {}
        try {
            ordersList = await Order.find({ unique_id: userId });
            const tempData = await User.findOne({ unique_id: userId });
            userData = tempData.toObject();
            delete userData.passwordConf;
            delete userData.password;
            delete userData.pushToken;
            console.log(userData);
        } catch (err) {
            console.log(err)
        }
        const productsList = await Products.find();

        const response = {
            user: userData,
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