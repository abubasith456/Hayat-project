const Category = require("../models/category");
const express = require("express");
const { responseAddProduct, responseFetchProduct } = require("../utils/responseModel");
const router = express.Router();
const firebase = require("../utils/firebase");
const { filePath } = require("../utils/upladImageUtils");
const multer = require('multer');
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

router.get("/", async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(
        categoryList);
});


//GetCategory
router.get("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res
            .status(500)
            .json({ message: "the category with the given ID not found" });
    }
    res.status(200).send(category);
});


//Add
router.post("/", upload.single('file'), async (req, res) => {

    await firebase.uploadFile(req.file.path, "Category/" + req.file.filename)
    await firebase.generateSignedUrl(req.file.filename).then(res => {
        imageUrl = res
    })

    if (imageUrl == "") {
        imageUrl = req.file.path
    }

    console.log(req.body);
    let category = new Category({
        name: req.body.name,
        description: req.body.description,
        image: imageUrl,
        link: req.body.link,
    });
    category.save()
        .then(result => {
            res.status(200).send(responseFetchProduct(true, result))
        }).catch(error => {
            res.status(400).send(responseAddProduct(false,));
        })
});


//Upadte
router.put("/:id", async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true }
    );

    if (!category) return res.status(400).send("the category cannot be created");

    res.send(category);
});


//delete
router.delete("/:id", (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                return res
                    .status(200)
                    .json({ success: true, message: "the category deleted" });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: "categry not found" });
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        });
});

module.exports = router;