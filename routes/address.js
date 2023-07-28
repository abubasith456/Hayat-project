const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Address = require("../models/address");

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

    const address = new Address(req.body);

    try {
        const address = await address.save();

        res.status(500).send(successResponse(address));
    } catch (err) {
        console.log(err);
        res.status(500).send(failedResponse(err));
    }

});

router.get("/:user_id", async (req, res, next) => {

    console.log(req.params.user_id);

    try {
        const orders = await Address.find({ user_id: req.params.user_id });
        res.status(200).send(successResponse(orders));
    } catch (err) {
        res.status(500).send(failedResponse(err));
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    console.log(req.params.id);
    console.log(req.body);

    try {

        Address.updateOne({ _id: req.params.id },
            { $set: { status: req.body.status } }, function (err, data) {

                if (err) {
                    return res.status(500).send(failedResponse(err))
                } else {
                    return res.status(200).send(successResponse(data))
                }
            })

    } catch (err) {
        console.log(err);
        res.status(500).send(failedResponse(err));
    }


});

// //GET ALL
router.get("/", async (req, res) => {
    try {
        const address = await Address.find();
        res.status(200).json(successResponse(address));
    } catch (err) {
        res.status(500).json(failedResponse(err));
    }
});

//DELETE
router.delete("/:id", (req, res, next) => {
    Order.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).send(successResponse(result));
        })
        .catch(err => {
            res.status(500).send(failedResponse(err));
        });
});

module.exports = router;
