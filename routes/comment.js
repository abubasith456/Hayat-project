const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/postNews');
const Comment = require('../models/comments');
const response = require('../utils/responseModel');


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


router.delete('/:id', async (req, res) => {

    Comment.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).send(response.successResponse(result));
        })
        .catch(error => {
            res.send(500).send(response.failedResponse(error))
        });

});

module.exports = router;