var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
	unique_id: Number,
	email: String,
	username: String,
	dateOfBirth: String,
	mobileNumber: String,
	password: String,
	passwordConf: String,
	pushToken: String,
	token: String,
	role: String,
	profilePic: String,
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
}),
	User = mongoose.model('User', userSchema);

module.exports = User;