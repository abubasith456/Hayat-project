const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const PersonalCare = require("../models/personalCare");
const { responseAddProduct, responseFetchProduct } = require("../utils/responseModel");

const firebase = require("../utils/firebase")
var imageUrl = ""

//Disk storage where image store
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
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
router.post("/", upload.single('file'), async (req, res, next) => {

    await firebase.uploadFile(req.file.path, "PersonalCare/" + req.file.filename)
    await firebase.generateSignedUrl(req.file.filename).then(res => {
        imageUrl = res
    })

    if (imageUrl == "") {
        imageUrl = req.file.path
    }

    console.log(req.body)
    const fruites = PersonalCare({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: imageUrl,
        isLiked: req.body.isLiked,

    });
    fruites
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
    PersonalCare.find()
        .select("name price description _id fruiteImage isLiked")
        .exec()
        .then(result => {
            res.status(200).send(responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});

//Update products
router.put('/:id', upload.single('fruitImage'), async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const updateOps = {};
    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }

    console.log(updateOps);
    PersonalCare.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Delete products
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    PersonalCare.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Fruit item deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});




module.exports = router;
