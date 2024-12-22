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
				// Validate only if the email field is updated
				if (this.isModified('email') && value) {
					return !this.mobileNumber;
				}
				return true;
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
				// Validate only if the mobileNumber field is updated
				if (this.isModified('mobileNumber') && value) {
					return !this.email;
				}
				return true;
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
		enum: ['user', 'admin', 'customer'],
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

// Pre-update hook to ensure validation happens only when email or mobileNumber are updated
// userSchema.pre('findOneAndUpdate', function (next) {
// 	const update = this.getUpdate();
// 	const user = this._conditions;

// 	// Check if email and mobileNumber are both in the update query
// 	if (update.email && update.mobileNumber) {
// 		const error = new Error('Email and mobile number cannot both be provided.');
// 		return next(error);  // Return error if both fields are set
// 	}

// 	// Proceed with the update
// 	next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
