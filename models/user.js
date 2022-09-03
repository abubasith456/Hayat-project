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
}),
	User = mongoose.model('User', userSchema);

module.exports = User;