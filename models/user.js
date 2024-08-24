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
		sparse: true,  // Indexing only if present
		validate: {
			validator: function (value) {
				return !this.mobileNumber || (this.mobileNumber && !value); // Either mobileNumber is empty or both fields are empty
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
		sparse: true,  // Indexing only if present
		validate: {
			validator: function (value) {
				return !this.email || (this.email && !value); // Either email is empty or both fields are empty
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
		enum: ['user', 'admin'],
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

// Create an index for frequently queried fields to improve performance
userSchema.index({ email: 1 });
userSchema.index({ unique_id: 1 });
userSchema.index({ mobileNumber: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
