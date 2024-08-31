const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Utility functions for responses
function successResponse(message) {
    return {
        "status": 200,
        "connection": "Connected",
        "message": message
    };
}

function failedResponse(message) {
    return {
        "status": 400,
        "connection": "Disconnected",
        "message": message
    };
}

function profileResponse(message, statusCode, data) {
    return {
        "status": statusCode,
        "connection": "Connected",
        "message": message,
        "data": data,
    };
}

// Profile API to fetch user profile data
router.post('/', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findOne({ unique_id: userId });

        if (!user) {
            return res.status(201).send(failedResponse('Data not found!'));
        }

        res.status(200).send(profileResponse('Success', 200, user));
    } catch (err) {
        console.error('Error fetching profile data:', err);
        res.status(500).send(failedResponse('Internal Server Error'));
    }
});

// User Role API to fetch user role based on userId
router.get('/userRole', async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findOne({ unique_id: userId });

        if (!user) {
            return res.status(201).json({ error: 'User not found' });
        }

        res.json({ role: user.role });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
