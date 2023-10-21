const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const User = require('../models/user');
const Post = require('../models/postNews');
const Comment = require('../models/comments');
const firebase = require("../utils/firebase")
var imageUrl = ""

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

function failedResponse(message) {
    return {
        "status": 500,
        "connection": "Disconnected",
        "message": message,
        "userData": {

        }
    }
}

router.get("/", async (req, res) => {
    Post.find()
        .then((post) => {
            const response = {
                count: post.length,
                products: post.map(doc => {
                    return {
                        _id: doc._id,
                        postId: doc.postId,
                        postedBy: doc.postedBy,
                        caption: doc.caption,
                        imageUrl: doc.imageUrl,
                        liked: doc.liked,
                        request: {
                            type: "GET",
                            url: "http://localhost:4000/products/" + doc._id
                        }


                    };
                })
            };
            res.status(200).json(response);
        })
        .catch((error) => {
            res.status(500).json({ error: 'An error occurred while retrieving posts.' });
        });
})

// Route to create a post
router.post('/', upload.single('file'), async (req, res) => {
    const { caption } = req.body;

    await firebase.uploadFile(req.file.path, req.file.filename)
    await firebase.generateSignedUrl(req.file.filename).then(res => {
        imageUrl = res
    })

    if (imageUrl == "") {
        imageUrl = req.file.path
    }

    User.findOne({ unique_id: req.body.userId }, function (err, data) {
        if (!data) {
            res.send(failedResponse('Data not found!'))
        } else {
            console.log(" Data => " + data)
            const post = Post({
                postId: data,
                postedBy: req.body.userId,
                caption: caption,
                imageUrl: imageUrl,
                liked: req.body.liked,

            });
            post.save()
                .then((post) => {

                    res.status(200).json(post);

                })
                .catch((error) => {
                    res.status(500).json({ error: 'An error occurred while creating the post.' });
                });
        }
    });

});



module.exports = router;