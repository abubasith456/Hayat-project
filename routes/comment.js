const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const User = require('../models/user');
const Post = require('../models/postNews');
const Comment = require('../models/comments');


router.post('/', async (req, res) => {
    console.log(req.body)
    User.findOne({ unique_id: req.body.userId }, function (err, data) {
        if (!data) {
            res.send(failedResponse('Data not found!'))
        } else {
            console.log(" Data => " + data)
            Post.findOne({ postId: req.body.postId }, function (err, postData) {
                if (!postData) {
                    res.send(failedResponse('Data not found!: ' + err))
                } else {
                    var comment = Comment({
                        user: data,
                        post: postData,
                        userId: req.body.userId,
                        text: req.body.comment
                    })

                    comment.save()
                        .then((post) => {
                            res.status(200).json(post);
                        })
                        .catch((error) => {
                            res.status(500).json({ error: 'An error occurred while creating the post.' });
                        });

                }

            })
        }
    });

});

module.exports = router;