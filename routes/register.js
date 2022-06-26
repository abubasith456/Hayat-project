var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
const bcrypt = require("bcrypt");


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


//Register user
router.post('/', async function (req, res, next) {

    console.log(req.body);
    var value = req.body;

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const password = await bcrypt.hash(value.password, salt);

    if (!value.email || !value.username || !value.password || !value.passwordConf) {
        res.status(400).send('Please give the all information');
    } else {
        if (value.password == value.passwordConf) {

            User.findOne({ email: value.email }, function (err, data) {
                if (!data) {
                    var id;
                    User.findOne({}, function (err, data) {

                        //Generate unique_id
                        if (data) {
                            console.log("unique_id generated");
                            id = data.unique_id + 1;
                        } else {
                            id = 1;
                        }

                        var newPerson = new User({
                            unique_id: id,
                            email: value.email,
                            username: value.username,
                            dateOfBirth: value.dateOfBirth,
                            mobileNumber: value.mobileNumber,
                            password: password,
                            passwordConf: value.passwordConf
                        });

                        newPerson.save(function (err, Person) {
                            if (err)
                                console.log(err);
                            else
                                console.log('Success');
                            res.send(successResponse('Registered Successfully.'));
                        });

                    }).sort({ _id: -1 }).limit(1);

                } else {
                    res.send(failedResponse('Email is already registered'));
                }

            });
        } else {
            res.send(failedResponse('password is not matched'));
        }
    }
});

module.exports = router;