const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var axios = require('axios');
const Order = require("../models/order");
const Product = require("../models/product");
var User = require('../models/user');
const pushApi = "https://fcm.googleapis.com/fcm/send";
const { responseAddProduct, responseFetchProduct, failedResponse, successResponse } = require("../utils/responseModel");

//Post order
router.post("/", async (req, res, next) => {
    try {
        console.log(req.body);
        const order = new Order(req.body);
        const orders = await order.save();

        if (orders) {
            const data = await User.findOne({ unique_id: req.body.unique_id })
            console.log(data.pushToken);
            if (data) {
                /* var data = JSON.stringify({
                    "content_available": true,
                    "priority": "high",
                    "to": data.pushToken,
                    "notification": {
                        "title": "Order Placed",
                        "body": "We are preparing your orders..."
                    }
                }); */

                var config = {
                    method: 'post',
                    url: pushApi,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'key=AAAAKXRRooI:APA91bH9pMJziYPRNRI2XyMaSIG_e5a-eJzxMSkaozaCrmCencitDrTul4XyrVAV87K6d-56zGJC49y7Cz6mTRpcxca16QzmF1TF8EW7OmxHPvcQdseHWoD3TIAe62u2gfY0pVXlhJ8Y'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

            // If order placed it will send push notification to admin
            // Who will deliver the order
            const adminUsers = await User.find({ role: 'admin' });

            if (adminUsers) {
                await Promise.all(adminUsers.map(async (data) => {
                    console.log("Hope it will work" + data.pushToken)
                    var data = JSON.stringify({
                        "content_available": true,
                        "priority": "high",
                        "to": data.pushToken,
                        "notification": {
                            "title": "Order Placed",
                            "body": "New order placed. Take ready :)"
                        }
                    });

                    var config = {
                        method: 'post',
                        url: pushApi,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'key=AAAAKXRRooI:APA91bH9pMJziYPRNRI2XyMaSIG_e5a-eJzxMSkaozaCrmCencitDrTul4XyrVAV87K6d-56zGJC49y7Cz6mTRpcxca16QzmF1TF8EW7OmxHPvcQdseHWoD3TIAe62u2gfY0pVXlhJ8Y'
                        },
                        data: data
                    };

                    axios(config)
                        .then(function (response) {
                            console.log(JSON.stringify(response.data));
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                }));
            } else {
                console.log("Admin Users not found!")
            }
        }

        res.status(200).json(responseAddProduct(true, "Order placed!"));

    } catch (err) {
        res.status(500).json(responseAddProduct(false, err));
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        console.log(req.body);

        const data = await Order.updateOne({ _id: req.params.id },
            { $set: { status: req.body.status } }).exec();

        if (data) {
            try {
                var statusText = ""

                if (req.body.status == "Cancelled" || req.body.status == "cancelled") {
                    statusText = "You're order is cancelled"
                } else if (req.body.status == "Accepted" || req.body.status == "accepted") {
                    statusText = "You're order is accepted by the dealer :) "
                } else if (req.body.status == "Preparing" || req.body.status == "preparing") {
                    statusText = "You're order is about to packing :) "
                }

                const data = await User.findOne({ unique_id: req.body.unique_id }).exec();
                if (data) {
                    console.log(data.pushToken);
                    var config = {
                        method: 'post',
                        url: pushApi,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'key=AAAAKXRRooI:APA91bH9pMJziYPRNRI2XyMaSIG_e5a-eJzxMSkaozaCrmCencitDrTul4XyrVAV87K6d-56zGJC49y7Cz6mTRpcxca16QzmF1TF8EW7OmxHPvcQdseHWoD3TIAe62u2gfY0pVXlhJ8Y'
                        },
                        data: data
                    };
                    axios(config)
                        .then(function (response) {
                            console.log(JSON.stringify(response.data));
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            return res.status(400).send(failedResponse(err))
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// //GET USER ORDERS
// router.get("/:id", async (req, res) => {

//     console.log(req.params.unique_id);

//     try {
//         const orders = await Order.find({ id: req.params.id });
//         res.status(200).json(orders);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//find order by unique_id
router.get("/:unique_id", async (req, res, next) => {
    try {
        console.log(req.params.unique_id);
        const orders = await Order.find({ unique_id: req.params.unique_id });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //GET ALL
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send(successResponse(orders));
    } catch (err) {
        res.status(500).send(failedResponse(err));
    }
});


//delete order
router.delete("/:orderId", async (req, res, next) => {
    await Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json(successResponse(result));
        })
        .catch(err => {
            res.status(500).json(failedResponse(err));
        });
});

module.exports = router;