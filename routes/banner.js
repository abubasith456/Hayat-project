const express = require("express");
const router = express.Router();
var Banner = require('../Database/models/banner');
const mongoose = require("mongoose");
const multer = require('multer');
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

router.post("/", upload.any(), async (req, res) => {
    console.log(req.body); // Log non-file data
    const uploadedFiles = req.files; // Uploaded files
    let bannerImage = ""

    let bannerImageName = uploadedFiles.find(
        (f) => f.fieldname.includes('banner')
    );

    if (bannerImageName != "" && bannerImageName != undefined) {

        let bannerImagePath = uploadedFiles.find(
            (f) => f.path.includes('banner')
        );
        await firebase.uploadFile(bannerImagePath, "bannerImage/" + bannerImageName);

        // Generating signed URL for the uploaded image
        await firebase.generateSignedUrl("bannerImage/" + bannerImageName)
            .then((url) => {
                imageUrl = url;
            })
            .catch((err) => {
                console.error(`Error generating signed URL for ${fileName.filename}:`, err);
                return res.status(500).json({ error: 'Error generating image URL.' });
            });
    }

    try {
        const { name, percentage, products } = req.body; // Non-file data

        const bannerProducts = [];
        let imageUrl = ''; // Declare imageUrl variable

        for (let i = 0; i < products.length; i++) {
            const product = products[i]; // Directly use product if it's already an object
            const fileName = uploadedFiles.find(
                (f) => f.fieldname === `products[${i}][image]`
            );

            // If no file is found for the product, skip
            if (!fileName) {
                console.log(`No image found for product ${i}`);
                continue;
            }

            const filePath = fileName.path;

            // Upload file and generate the signed URL
            await firebase.uploadFile(filePath, "bannerProducts/" + fileName.filename);

            // Generating signed URL for the uploaded image
            await firebase.generateSignedUrl("bannerProducts/" + fileName.filename)
                .then((url) => {
                    imageUrl = url;
                })
                .catch((err) => {
                    console.error(`Error generating signed URL for ${fileName.filename}:`, err);
                    return res.status(500).json({ error: 'Error generating image URL.' });
                });

            bannerProducts.push({
                _id: new mongoose.Types.ObjectId(),
                name: product.name,
                image: imageUrl,
                price: product.price,
            });
        }

        const banner = new Banner({
            _id: new mongoose.Types.ObjectId(),
            name,
            percentage,
            bannerImage,
            products: bannerProducts,
        });

        const savedBanner = await banner.save();
        res.status(201).json({ message: 'Banner created successfully', savedBanner });
    } catch (error) {
        console.error('Error in creating banner:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", function (req, res) {
    Banner.find()
        .exec()
        .then((data) => {
            console.log(data)
            try {
                const response = {
                    count: data.length,
                    products: data
                };
                res.status(200).json(response);
            } catch (e) {
                res.status(400).json({
                    error: e
                });
            }

        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        })
});

module.exports = router;


