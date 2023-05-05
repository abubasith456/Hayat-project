const express = require("express");
const router = express.Router();
var Banner = require('../models/banner');

router.post("/", function (req, res) {

    console.log(req.body);

    try {

        const banner = Banner({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            percentage: req.body.percentage,
            products: req.body.products,
        });


        banner.save()
            .then(result => {
                res.send("Success bro").status(200)
            }).catch(err => {
                console.log(err.message);
                res.status(500).json({
                    error: err
                });
            });

    } catch (e) {
        console.log(e)
        res.send("Failed bro").status(500)
    }


});

module.exports = router;


