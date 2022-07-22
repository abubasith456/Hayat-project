var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
const bcrypt = require("bcrypt");


function successResponse(message, data) {
    return {
        "status": 200,
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

function failedResponse(message) {
    return {
        "status": 500,
        "connection": "Connected",
        "message": message,
        "userData": {

        }
    }
}

//Login user
router.post('/', function (req, res, next) {

    var value = req.body;

    if (!value.email || !value.password) {
        res.status('Please give the all information')
    } else {
        User.findOne({ email: value.email }, async function (err, data) {
            if (data) {

                //Validate password.
                const validPassword = await bcrypt.compare(value.password, data.password);

                if (validPassword) {

                    req.userId = data.unique_id;
                    //console.log(req.session.userId);
                    console.log(data);
                    // var data = {
                    //     "status": 200,
                    //     "connection": "Connected",
                    //     "message": "Login success",
                    //     "userData": {
                    //         "user_id": data.unique_id,
                    //         "username": data.username,
                    //         "email": data.email,
                    //         "dateOfBirth": data.dateOfBirth,
                    //         "mobileNumber": data.mobileNumber
                    //     }
                    // }
                    // res.send(profileResponse('Login Success', 200, data));
                    res.send(successResponse("Login success", data));
                } else {
                    res.send(failedResponse('Wrong password!'));
                }
            } else {
                res.send(failedResponse('This Email Is not regestered!'));
            }
        });
    }

});

module.exports = router;