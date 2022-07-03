const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Dairy = require("../models/dairy");

//Disk storage where image store
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/dairy');
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
router.post("/", upload.single('dairyImage'), async (req, res, next) => {
    // const category = await Category.findById(req.body.category);
    // console.log(category);
    // if (!category) return res.status(400).send("Invalid Category");

    console.log(req.body)
    const dairy = Dairy({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        dairyImage: req.file.path,

    });
    vegetable
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    description: result.description,
                    dairyImage: result.dairyImage,
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
    Dairy.find()
        .select("name price description _id dairyImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        description: doc.description,
                        dairyImage: doc.dairyImage,
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
router.put('/:id', upload.single('dairyImage'), async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const updateOps = {};
    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }

    console.log(updateOps);
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

    // // objForUpdate = { $set: objForUpdate }

    console.log(updateOps);
    Dairy.updateOne({ _id: id }, { $set: updateOps })
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
    Dairy.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Dairy deleted',
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
