var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

function profileResponse(message, statusCode, data) {
    return {
        "status": statusCode,
        "connection": "Connected",
        "message": message,
        "data": data,
    }
}


// //Watch your profile
router.post('/', function (req, res, next) {

    User.findOne({ unique_id: req.body.userId }, function (err, data) {

        if (!data) {
            res.send(failedResponse('Data not found!'))
        } else {

            res.send(profileResponse('Success', 200, data))

        }
    });
});

module.exports = router;