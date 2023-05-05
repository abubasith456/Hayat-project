const express = require("express");
const router = express.Router();
var Banner = require('../models/banner');

router.post("/", function (req, res) {

    console.log(req);

    try {

        const banner = new Banner(req.body).save()

        if (banner != null) {
            res.send("Success bro").status(200)
        } else {
            res.send("Failed bro").status(500)
        }

    } catch (e) {
        console.log(e)
        res.send("Failed bro").status(500)
    }


});

module.exports = router;


