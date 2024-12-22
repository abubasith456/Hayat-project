var express = require('express');
var router = express.Router();
var User = require('../models/user');
const multer = require('multer');
const firebase = require("../utils/firebase")
var imageUrl = ""

function successResponse(message, data) {
    return {
        "status": 200,
        "connection": "Connected",
        "message": message,
        "data": data,
    }
}

function failedResponse(message) {
    return {
        "status": 400,
        "connection": "Dissconnected",
        "message": message
    }
}

//Disk storage where image store
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

//Check the image formate
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


//Update profile and watch
router.post('/', upload.single('file'), async (req, res) => {
    try {

        const user = await User.findOne({ unique_id: req.body.userId });

        if (!user) {
            return resres.status(404).send(failedResponse('User not found!'));
        }

        const file = req.file
        if (file && !file.includes("https://storage.googleapis.com")) {
            // Upload the file to Firebase Storage
            await firebase.uploadFile(file.path, "ProfilePictures/" + file.filename);

            // Generate a signed URL for the uploaded file
            const imageUrl = await firebase.generateSignedUrl("ProfilePictures/" + req.file.filename);

            // Update profilePic only if imageUrl is not empty
            if (imageUrl) {
                user.profilePic = imageUrl;
            } else {
                user.profilePic = req.file.path;
            }
        }

        if (req.body.username) {
            user.username = req.body.username;
        }
        if (req.body.dateOfBirth) {
            user.dateOfBirth = req.body.dateOfBirth;
        }

        // Update email or mobile number based on the request body
        if (req.body.mobileNumber) {
            user.mobileNumber = req.body.mobileNumber;
        } else if (req.body.email) {
            user.email = req.body.email;
        }

        const savedData = await user.save();
        console.log('Profile updated successfully');
        res.send(successResponse('Profile updated!', savedData));
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(400).send(failedResponse(error));
    }
});

module.exports = router;