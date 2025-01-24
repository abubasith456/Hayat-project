const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    postedBy: String,
    caption: String,
    imageUrl: String,
    liked: String,
});

module.exports = mongoose.model('Post', postSchema);