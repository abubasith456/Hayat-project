var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const googleClientId = process.env.GOOGLE_ID;
const { profileResponse, failedResponse } = require('../utils/responseModel');
const verifyGoogleToken = require('../core/auth');

const client = new OAuth2Client(googleClientId);

// Utility function to generate unique_id
async function generateUniqueId() {
    const lastUser = await User.findOne({}).sort({ _id: -1 }).limit(1);
    return lastUser ? lastUser.unique_id + 1 : 1;
}

// Email/Password Registration
router.post('/email', async function (req, res) {
    const { email, password, passwordConf, username, dateOfBirth } = req.body;

    if (!email || !username || !password || !passwordConf) {
        return res.status(201).send(failedResponse('Please provide all required information'));
    }

    if (password !== passwordConf) {
        return res.status(201).send(failedResponse('Passwords do not match'));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(201).send(failedResponse('Email is already registered'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const unique_id = await generateUniqueId();

        const newUser = new User({
            unique_id,
            email,
            username,
            dateOfBirth,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        res.send(profileResponse('Email registration successful.', 200, newUser));
    } catch (error) {
        res.status(500).send(failedResponse('Error registering user: ' + error.message));
    }
});

// Mobile Number Registration
router.post('/mobile', async function (req, res) {
    const { mobileNumber, password, passwordConf, username, dateOfBirth } = req.body;

    if (!mobileNumber || !username || !password || !passwordConf) {
        return res.status(201).send(failedResponse('Please provide all required information'));
    }

    if (password !== passwordConf) {
        return res.status(201).send(failedResponse('Passwords do not match'));
    }

    try {
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(201).send(failedResponse('Mobile number is already registered'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const unique_id = await generateUniqueId();

        const newUser = new User({
            unique_id,
            mobileNumber,
            username,
            dateOfBirth,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        res.status(200).send(profileResponse('Mobile number registration successful.', 200, newUser));
    } catch (error) {
        res.status(500).send(failedResponse('Error registering user: ' + error.message));
    }
});

// Google Registration
router.post('/google', async function (req, res) {
    const { googleToken } = req.body;

    if (!googleToken) {
        return res.status(400).send(failedResponse('ID Token is required'));
    }

    try {
        const googleUser = (await verifyGoogleToken(googleToken)).getPayload();
        const { email, name, id } = googleUser;

        let user = await User.findOne({ email });
        if (!user) {
            const unique_id = await generateUniqueId();
            user = new User({
                unique_id,
                email,
                username: name,
                role: 'user',
                googleId: id
            });

            await user.save();
        }

        res.status(200).send(profileResponse('Google registration successful.', 200, user));
    } catch (error) {
        res.status(500).send(failedResponse('Error registering user with Google: ' + error.message));
    }
});

module.exports = router;
