var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const { profileResponse, failedResponse } = require('../utils/responseModel');
const verifyGoogleToken = require('../core/auth');

// Middleware to parse JSON bodies
router.use(express.json());

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
            // Verify Google token and get user information (implementation varies)
            const googleUser = await verifyGoogleToken(googleToken); // Implement this function
            user = await User.findOne({ googleId: googleUser.id }); // Adjust field based on your schema

            if (!user) {
                return res.status(404).send(failedResponse('Google user not found.'));
            }
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

        // Success
        req.userId = user.unique_id; // Set user ID in session or handle as needed
        console.log(user);
        res.status(200).send(profileResponse("Login successful", 200, user));
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send(failedResponse('Internal server error.'));
    }
});

module.exports = router;
