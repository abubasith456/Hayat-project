var mongoose = require('mongoose');

const diaryScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    dairyImage: {
        type: String,
    },
});

module.exports = mongoose.model('Diary', diaryScheme);