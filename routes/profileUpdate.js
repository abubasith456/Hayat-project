var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// //Watch your profile
// router.get('/profile', function (req, res, next) {

//     var session = {
//         "cookie": {
//             path: '/', _expires: null,
//             originalMaxAge: null,
//             httpOnly: true
//         },
//         userId: req.body.user_id
//     }

//     User.findOne({ unique_id: session.userId }, function (err, data) {

//         if (!data) {
//             // res.redirect('/');
//             res.send(failedResponse('Data not found!'))
//         } else {
//             //console.log("found");
//             // return res.render('data.ejs', { "name": data.username, "email": data.email });
//             // var dataJson = {
//             // 	"username": data.username,
//             // 	"email": data.email,
//             // 	"dateOfBirth": data.dateOfBirth,
//             // 	"mobileNumber": data.mobileNumber
//             // }
//             res.send(profileResponse('Success', 200, data))

//         }
//     });
// });


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
        "userData": {
            "user_id": data.unique_id,
            "username": data.username,
            "email": data.email,
            "dateOfBirth": data.dateOfBirth,
            "mobileNumber": data.mobileNumber
        }
    }
}


//Update profile and watch
router.post('/', async function (req, res, next) {

    User.findOne({ unique_id: req.body.userId }, function (err, data) {
        if (!data) {

            res.send(failedResponse('Session expired!'))
        } else {

            data.username = req.body.username;
            data.dateOfBirth = req.body.dateOfBirth;
            data.mobileNumber = req.body.mobileNumber;

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