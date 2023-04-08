const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var axios = require('axios');
const Order = require("../models/order");
const Product = require("../models/product");
var User = require('../models/user');
const pushApi = "https://fcm.googleapis.com/fcm/send";

function successResponse(message) {
    return {
        "status": 200,
        "connection": "Connected",
        "message": message
    }
}

function failedResponse(message) {
    return {
        "status": 400,
        "connection": "Dissconnected",
        "message": message
    }
}

//Post order
router.post("/", async (req, res, next) => {
    console.log(req.body);

    const order = new Order(req.body);

    try {
        const orders = await order.save();
        User.findOne({ unique_id: req.body.unique_id }, async function (err, data) {
            console.log(data.pushToken);
            if (data) {
                var data = JSON.stringify({
                    "content_available": true,
                    "priority": "high",
                    "to": data.pushToken,
                    "notification": {
                        "title": "Order Placed",
                        "body": "We are preparing your orders..."
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
            }
        });


        // If order placed it will send push notification to admin
        // Who will deliver the order
        User.find({ role: 'admin' }, async function (err, data) {

            if (data) {
                data.forEach(element => {
                    console.log("Hope it will work" + element.pushToken)
                    var data = JSON.stringify({
                        "content_available": true,
                        "priority": "high",
                        "to": element.pushToken,
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
                });

            } else {
                console.log("Data not found bro sorry")
            }
        });

        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    console.log(req.params.id);
    try {

        console.log(req.body);

        Order.updateOne({ _id: req.params.id },
            { $set: { status: req.body.status } }, function (err, _) {
                if (err) {
                    return res.send(failedResponse(err))
                } else {

                    try {
                        var statusText = ""

                        if (req.body.status == "Cancelled" || req.body.status == "cancelled") {
                            statusText = "You're order is cancelled"
                        } else if (req.body.status == "Accepted" || req.body.status == "accepted") {
                            statusText = "You're order is accepted by the dealer :) "
                        } else if (req.body.status == "Preparing" || req.body.status == "preparing") {
                            statusText = "You're order is about to packing :) "
                        }

                        User.findOne({ unique_id: req.body.unique_id }, async function (err, data) {
                            console.log(data.pushToken);
                            if (data) {
                                var data = JSON.stringify({
                                    "content_available": true,
                                    "priority": "high",
                                    "to": data.pushToken,
                                    "notification": {
                                        "title": "Order Status",
                                        "body": statusText
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
                            }
                        });
                    } catch (e) {
                        console.log(e)
                    }

                    return res.send(successResponse("Updated"))
                }
            })

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

    console.log(req.params.unique_id);

    try {
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
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


//delete order
router.delete("/:orderId", (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json(successResponse(result));
        })
        .catch(err => {
            res.status(500).json(failedResponse(err));
        });
});

module.exports = router;