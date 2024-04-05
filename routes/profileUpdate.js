var express = require('express');
var router = express.Router();
var User = require('../models/user');
const multer = require('multer');
const firebase = require("../utils/firebase")
var imageUrl = ""

function successResponse(message) {
    return {
        "status": 200,
        "connection": "Connected",
        "message": message
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
router.post('/', async function (req, res, next) {

    User.findOne({ unique_id: req.body.userId }, async function (err, data) {
        if (!data) {

            res.send(failedResponse('Session expired!'))
        } else {

            if (req.file) {
                await firebase.uploadFile(req.file.path, "ProfilePictures/" + req.file.filename)
                await firebase.generateSignedUrl("ProfilePictures/" + req.file.filename).then(res => {
                    imageUrl = res
                })
            
                if (imageUrl == "") {
                    data.profilePic = req.file.path
                }
            }

            if (req.body.username) {
                data.username = req.body.username;
            }
            if (req.body.dateOfBirth) {
                data.dateOfBirth = req.body.dateOfBirth;
            }
            if (req.body.mobileNumber) {
                data.mobileNumber = req.body.mobileNumber;
            }


            data.save(function (err, Person) {
                if (err) {
                    console.log(err);
                    res.send(failedResponse(err))
                }
                else {
                    console.log('Update successs');
                    res.send(successResponse('Profile updated!'));
                }
            })
        }

    });

});

module.exports = router;