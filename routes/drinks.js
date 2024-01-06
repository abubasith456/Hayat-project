const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Drinks = require("../models/drinks");
const { responseAddProduct, responseFetchProduct } = require("../utils/responseModel");
const firebase = require("../utils/firebase")
var imageUrl = ""

//Disk storage where image store
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/drinks');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

//Check the image formate
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Add products
router.post("/", upload.single('file'), async (req, res) => {

    await firebase.uploadFile(req.file.path, "Drinks/" + req.file.filename)
    await firebase.generateSignedUrl("Drinks/" + req.file.filename).then(res => {
        imageUrl = res
    })

    if (imageUrl == "") {
        imageUrl = req.file.path
    }

    console.log(req.body)
    const drinks = Drinks({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: imageUrl,
        isLiked: req.body.isLiked,

    });
    drinks
        .save()
        .then(result => {
            console.log(result);
            res.status(200).send(
                responseAddProduct(true, result));
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send(responseAddProduct(false, err));
        });
});

//Get products
router.get("/", (req, res, next) => {
    Drinks.find()
        .exec()
        .then(result => {
            res.status(200).send(
                responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});

//Update products
router.put('/:id', upload.single('drinksImage'), async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const updateOps = {};
    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }

    console.log(updateOps);
    Drinks.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).send(
                responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});

//Delete products
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Vegetables.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).send(
                responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});


module.exports = router;
