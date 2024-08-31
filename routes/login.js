var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const { profileResponse, failedResponse, successResponse } = require('../utils/responseModel');
const verifyGoogleToken = require('../core/auth');

// Middleware to parse JSON bodies
router.use(express.json());

// Utility function to generate unique_id
async function generateUniqueId() {
    const lastUser = await User.findOne({}).sort({ _id: -1 }).limit(1);
    return lastUser ? lastUser.unique_id + 1 : 1;
}

// Login user
router.post('/', async function (req, res, next) {
    const { email, mobileNumber, password, googleToken } = req.body;

    // Validate input
    if (!email && !mobileNumber && !googleToken) {
        return res.status(400).send(failedResponse('Please provide email, mobile number, or Google token.'));
    }

    try {
        let user;
        // If Google token is provided, handle Google login
        if (googleToken) {
            // Verify Google token and get user information
            const googleUserDetails = await verifyGoogleToken(googleToken);
            const googleUser = googleUserDetails.getPayload();
            console.log("Google user = ", googleUser.name);
            console.log("Google user = ", googleUser.email);
            // Find user by Google ID
            await User.findOne({ email: googleUser.email }).exec().then(async (existUser) => {
                if (existUser) {
                    user = existUser;
                } else {
                    console.log(" User not found!");
                    // If user is not found, create a new user
                    const generatedUniqueId = await generateUniqueId();
                    const googleUserId = googleUserDetails.getUserId();
                    const password = googleUser.email + "/" + googleUserId;
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = new User({
                        unique_id: generatedUniqueId, // Implement this function to generate a unique ID
                        email: googleUser.email,
                        username: googleUser.name,
                        profilePic: googleUser.picture,
                        googleId: googleUserId,
                        password: hashedPassword
                        // Add other fields if needed
                    });
                    console.log(newUser);
                    await newUser.save(); // Save the new user to the database
                    user = newUser;
                }
            }); // Use .exec() to ensure a promise is returned
        } else {
            // Handle email or mobile number login
            if (email) {
                user = await User.findOne({ email });
            } else if (mobileNumber) {
                user = await User.findOne({ mobileNumber });
            }

            if (!user) {
                return res.status(404).send(failedResponse('User not found.'));
            }

            // Validate password if email or mobile number is used
            if (password) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return res.status(400).send(failedResponse('Wrong password.'));
                }
            }
        }

        // // Success
        // req.userId = user.unique_id; // Set user ID in session or handle as needed
        // console.log(user);
        res.status(200).send(profileResponse("Login successful", 200, user));
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send(failedResponse('Internal server error.'));
    }
});

module.exports = router;
