var mongoose = require('mongoose');
var Schema = mongoose.Schema;

addressSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: String
    },
    address: [
        {
            name: {
                type: String
            },
            userId: {
                type: String
            },
            mobileNumber: {
                type: String
            },
            pinCode: {
                type: String
            },
            address: {
                type: String
            },
            area: {
                type: String
            },
            landMark: {
                type: String
            },
            alterMobileNumber: {
                type: String
            }

        }
    ]
},
    { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);