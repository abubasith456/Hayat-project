const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const User = require('../models/user');
const Post = require('../models/newPost');
const firebase = require("../utils/firebase");
const { successResponse, failedResponse } = require("../utils/responseModel");
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
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

router.post('/create', upload.single('file'), async (req, res, next) => {
    console.log(req.body);
    var image = [];
    await firebase.uploadFile(req.file.path, req.file.filename)
    await firebase.generateSignedUrl(req.file.filename).then(res => {
        imageUrl = res
    })

    if (imageUrl == "") {
        imageUrl = req.file.path
    }

    try {
        const data = await User.findOne({ unique_id: req.body.userId });
        if (!data) {
            res.send(failedResponse('Data not found!'))
        } else {
            console.log(" Data => " + data)
            const newPost = await Post.create({
                user: data,
                image: imageUrl,
                caption: req.caption,
                location: req.location,
                likes: data,
                profile: data,
            }).then(result => {
                res.status(200).send(successResponse(newPost));
            }).catch(error => {
                res.status(500).send(failedResponse(error));
            });
        }
    } catch (e) {

    }

});

router.get('/', async (req, res, next) => {
    const posts = await Post.find({})
        .sort({ createdAt: 'descending' })
        .populate('user');
    // const populatedPost = await posts.populate('profile').execPopulate();
    res.status(200).json({
        status: 'success',
        count: posts.length,
        posts,
    });
});

router.get('/byId', async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'profile',
        select: '-bio -website -user -_v',
    });

    if (!post) {
        return next(new AppError('Post not found', 400));
    }

    res.status(200).json({
        status: 'success',
        post,
    });
});

router.delete('/', async (req, res, next) => {
    //const post = await Post.deleteOne({ _id: req.params.id });
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new AppError('Post not found', 400));
    }
    //  console.log(post, post.user.toString() === req.user.id)
    if (post.user.toString() !== req.user.id) {
        return next(
            new AppError('You are not authorized to delete this post', 401)
        );
    }

    post.commentsPost.length &&
        (await Comment.findByIdAndDelete(post.commentsPost[0]._id));

    await post.remove();

    res.status(200).json({
        message: 'deleted',
    });
});

router.post('/like', async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('profile');

    if (!post) {
        return next(new AppError('Post not found', 400));
    }
    const id = await post.getProfileId(req.user.id);

    if (post.likes.includes(id)) {
        const index = post.likes.indexOf(id);
        post.likes.splice(index, 1);
        await post.save((err) => {
            console.log(err);
        });
        await Notification.deleteMany({
            to: post.profile._id,
            user: id,
            type: 'Like',
        });
    } else {
        post.likes.push(id);
        await post.save();
    }

    res.status(200).json({
        status: 'success',
        post,
    });
});

module.exports = router;