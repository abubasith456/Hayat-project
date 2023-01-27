const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var axios = require('axios');
const Order = require("../models/order");
const Product = require("../models/product");
var User = require('../models/user');
const pushApi = "https://fcm.googleapis.com/fcm/send";
// var admin = require("firebase-admin");
// var fcm = require("fcm-notification");
// var serviceAccount = require("../push-notification-key.json");
// var credPath = admin.credential.cert(serviceAccount);
// var FCM = new fcm(credPath);

// Handle incoming GET requests to /orders
// router.get("/", (req, res, next) => {
//     Order.find()
//         .select("product quantity _id")
//         .populate('product', 'name')
//         .exec()
//         .then(docs => {
//             res.status(200).json({
//                 count: docs.length,
//                 orders: docs.map(doc => {
//                     return {
//                         _id: doc._id,
//                         product: doc.product,
//                         quantity: doc.quantity,
//                         request: {
//                             type: "GET",
//                             url: "http://localhost:3000/orders/" + doc._id
//                         }
//                     };
//                 })
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


//Post order
router.post("/", async (req, res, next) => {
    console.log(req.body);

    const order = new Order(req.body);

    try {
        const orders = await order.save();
    
        if(!orders.$isEmpty) {
            User.findOne({ unique_id: req.body.unique_id }, async function (err, data) {
                console.log(data.pushToken);
                if (data) {
                    var data = JSON.stringify({
                        "content_available": true,
                        "priority": "high",
                        "to": data.pushToken,
                        "notification": {
                            "title": "Order Placed",
                            "body": "We are preparing your items..."
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
            res.status(200).json(orders);
        } else {
            res.status(500).json("");
        }

        // try {
        //     let message = {
        //         notification: {
        //             title: "Order Placed",
        //             body: "Your order is on the way...."
        //         },
        //         data: {
        //             orderId: "123444",
        //             orderName: "hbchjsbc",
        //         },
        //         token: "f42QVjpxSiSCTExP1R5f2R:APA91bFfOHC58Jm4dsclBrbl4-6Pn4HF4wtKjikueZaJItXHbHQO1uzFS5yMvyt0_M4gE573egpVBXgACTXZ4fCVs_hJjmwWfY3-2ZWmK7brWQjFy_U29DuMGotKttPucuGKERnQDBSM",

        //     }

        //     FCM.send(message, function (err, res) {
        //         if (err) {
        //             console.log(err)
        //         } else {
        //             console.log("Notified")
        //         }
        //     });
        // } catch (err) {
        //     res.status(500).json(err);
        // }


    } catch (err) {
        res.status(500).json(err);
    }

    // Product.findById(req.body.productId)
    //     .then(product => {
    //         if (!product) {
    //             return res.status(404).json({
    //                 message: "Product not found"
    //             });
    //         }
    //         const order = new Order({
    //             _id: mongoose.Types.ObjectId(),
    //             quantity: req.body.quantity,
    //             product: req.body.productId
    //         });
    //         return order.save();
    //     })
    //     .then(result => {
    //         console.log(result);
    //         res.status(201).json({
    //             message: "Order placed sucessfully",
    //             createdOrder: {
    //                 _id: result._id,
    //                 product: result.product,
    //                 quantity: result.quantity
    //             },
    //             request: {
    //                 type: "GET",
    //                 url: "http://localhost:3000/orders/" + result._id
    //             }
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
});

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
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

    // Order.findById(req.params.orderId)
    //     .populate('product')
    //     .exec()
    //     .then(order => {
    //         if (!order) {
    //             return res.status(404).json({
    //                 message: "Order not found"
    //             });
    //         }
    //         res.status(200).json({
    //             order: order,
    //             request: {
    //                 type: "GET",
    //                 url: "http://localhost:3000/orders"
    //             }
    //         });
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
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
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;