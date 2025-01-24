var mongoose = require('mongoose');

const specialOffer = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    offerName: { type: String, require: true },
    offerBannerImage: { type: String, require: true }
})

module.exports = mongoose.model('Offers', specialOffer);