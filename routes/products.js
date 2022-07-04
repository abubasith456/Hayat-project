const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Product = require("../models/product");
const { Category } = require("../models/category");


//Disk storage where image store
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products');
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

//image size
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Add products
router.post("/", upload.single('productImage'), async (req, res, next) => {

    console.log(req.body)
    const product = Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        productImage: req.file.path,
        rating: req.body.rating,
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    description: result.description,
                    rating: result.rating,
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
    Product.find()
        .select("name price description category _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        description: doc.description,
                        productImage: doc.productImage,
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
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const updateOps = {};
    for (const ops of Object.keys(req.body)) {
        updateOps[ops.propName] = ops.value;
    }

    // const product = new Product({
    //     _id: new mongoose.Types.ObjectId(),
    //     name: req.body.name,
    //     price: req.body.price,
    //     description: req.body.description,
    //     category: req.body.category,
    //     productImage: req.file.path,
    //     rating: req.body.rating,
    // });

    Product.findOne({ _id: id }, function (err, data) {
        if (!data) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            if (req.body.name != "") {
                data.name = req.body.name
            }
            if (req.body.price != "") {
                data.price = req.body.price
            }
            if (req.body.description != "") {
                data.description = req.body.description
            }
            if (req.body.productImage != "") {
                data.productImage = req.body.productImage
            }
            if (req.body.rating != "") {
                data.rating = req.body.rating
            }

            data.save(function (err, Person) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                } else {
                    res.status(200).json({
                        message: 'Product updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + id
                        }
                    });
                }
            });
        }
    });

    // Product.updateOne({ _id: id }, { $set: updateOps })
    //     .exec()
    //     .then(result => {
    //         res.status(200).json({
    //             message: 'Product updated',
    //             request: {
    //                 type: 'GET',
    //                 url: 'http://localhost:4000/products/' + id
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


//Delete products
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
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


    // Product.findOne({ _id: req.body.productId }, (err, data) => {

    //     if (!data) {
    //         res.status(500).json({
    //             err: 'Data not found'
    //         });
    //     } else {
    //         data.Product = req.body.Product;
    //         data.price = req.body.price;

    //         data.save(function (err, Person) {
    //             if (err) {
    //                 res.status(500).json({
    //                     err: err
    //                 })
    //             } else {
    //                 res.status(200).json({
    //                     message: 'Product updated',
    //                     request: {
    //                         trype: 'GET',
    //                         url: 'http://localhost:4000/products/' + data._id
    //                     }
    //                 })
    //             }
    //         });

    //     }
    // }).catch(err => {
    //     console.log(err);
    //     res.status(500).json({
    //         error: err
    //     });
    // });