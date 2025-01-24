const mongoose = require('mongoose');
const Profile = require('./user');

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        caption: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        image: String,
        // comment: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Comment',
        // },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

postSchema.virtual('commentsPost', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
});

postSchema.methods.getProfileId = async function (id) {
    const { _id } = await Profile.findOne({ unique_id: id });
    return _id;
};

// //Todo
// postSchema.pre(/^find/, function (next) {
//   this.find().populate('commentsPost');

//   next();
// });

const Post = mongoose.model('PostTest', postSchema);

module.exports = Post;
