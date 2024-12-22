const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	unique_id: {
		type: Number,
		required: true,
		unique: true
	},
	email: {
		type: String,
		unique: true,
		sparse: true, // Index only if present
		validate: {
			validator: function (value) {
				// Validate during creation/updation that mobileNumber is empty if email is provided
				return !(value && this.mobileNumber);
			},
			message: 'Mobile number must be empty if email is provided.'
		}
	},
	username: {
		type: String,
		required: true
	},
	dateOfBirth: {
		type: String
	},
	mobileNumber: {
		type: String,
		unique: true,
		sparse: true, // Index only if present
		validate: {
			validator: function (value) {
				// Validate during creation/updation that email is empty if mobileNumber is provided
				return !(value && this.email);
			},
			message: 'Email must be empty if mobile number is provided.'
		}
	},
	password: {
		type: String,
		required: true
	},
	pushToken: {
		type: String
	},
	token: {
		type: String
	},
	role: {
		type: String,
		enum: ['user', 'admin','customer'],
		default: 'user'
	},
	googleId: {
		type: String
	},
	profilePic: {
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
}, {
	timestamps: true // This adds `createdAt` and `updatedAt` fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;
