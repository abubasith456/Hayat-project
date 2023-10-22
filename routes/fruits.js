const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Fruites = require("../models/fruits");

const firebase = require("../utils/firebase")
var imageUrl = ""

//Disk storage where image store
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/fruits');
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

    await firebase.uploadFile(req.file.path, req.file.filename)
    await firebase.generateSignedUrl(req.file.filename).then(res => {
        imageUrl = res
    })

    if (imageUrl == "") {
        imageUrl = req.file.path
    }

    console.log(req.body)
    const fruites = Fruites({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        fruiteImage: imageUrl,
        isLiked: req.body.isLiked,

    });
    fruites
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                product: {
                    productName: result.name,
                    productPrice: result.price,
                    productDescription: result.description,
                    productImage: result.fruitImage,
                    productisLiked: result.isLiked,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).json({
                error: err
            });
        });
});


//Get products
router.get("/", (req, res, next) => {
    Fruites.find()
        .select("name price description _id fruiteImage isLiked")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        productName: doc.name,
                        productPrice: doc.price,
                        productDescription: doc.description,
                        productImage: doc.fruiteImage,
                        productisLiked: doc.isLiked,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:4000/products/" + doc._id
                        }
                    };
                })
            };
            //   if (docs.length >= 0) {
            res.status(200).json(response);
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
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

    // console.log(updateOps);
    // function jsonParser(stringValue) {
    //     var string = JSON.stringify(stringValue);
    //     var objectValue = JSON.parse(string);
    //     return objectValue[stringValue];
    // }

    // var objForUpdate = {};

    // if (req.body.nome) objForUpdate.nome = req.body.nome;
    // if (req.body.price) objForUpdate.price = req.body.price;
    // if (req.body.description) objForUpdate.description = req.body.description;
    // if (req.body.vegetableImage) objForUpdate.vegetableImage = req.body.path;

    // //before edit- There is no need for creating a new variable
    // var setObj = { $set: objForUpdate }

    // objForUpdate = { $set: objForUpdate }

    console.log(updateOps);
    Fruites.updateOne({ _id: id }, { $set: updateOps })
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
    // Vegetables.updateOps({ _id: id }, function (err, data) {
    //     if (!data) {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     } else {
    //         if (req.body.name != "") {
    //             data.name = req.body.name
    //         }
    //         if (req.body.price != "") {
    //             data.price = req.body.price
    //         }
    //         if (req.body.description != "") {
    //             data.description = req.body.description
    //         }
    //         if (req.body.vegetableImage != "") {
    //             data.productImage = req.body.productImage
    //         }

    //         data.save(function (err, Person) {
    //             if (err) {
    //                 console.log(err);
    //                 res.status(500).json({
    //                     error: err
    //                 });
    //             } else {
    //                 res.status(200).json({
    //                     message: 'Product updated',
    //                     name: data.name,
    //                     price: data.price,
    //                     description: data.description,
    //                     vegetableImage: data.productImage,
    //                     _id: data._id,
    //                     request: {
    //                         type: 'GET',
    //                         url: 'http://localhost:4000/products/' + id
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
});

//Delete products
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Fruites.deleteOne({ _id: id })
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
