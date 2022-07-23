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
        "message": message,
    }
}

router.post('/', async function (req, res, next) {

    var newPassword = req.body.newPassword;
    var cnfrmNewPassword = req.body.cnfrmNewPassword;

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const password = await bcrypt.hash(newPassword, salt);

    const updateOps = {
        password: password,
        passwordConf: cnfrmNewPassword
    };

    // for (const ops of Object.keys(req.body)) {
    //     updateOps[ops] = req.body[ops];
    // }

    console.log(updateOps);

    // if (newPassword == cnfrmNewPassword) {

    User.findOne({ email: req.body.email }, function (err, data) {

        if (data) {

            User.updateOne({ email: data.email }, { $set: updateOps })
                .exec()
                .then(result => {
                    res.send(successResponse("Password changed successfully!")
                    );
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        } else {
            res.send(failedResponse("Email not registered!"))
        }

    });

    // }
    //  else {
    //     res.send(failedResponse("Password not matched"));
    // }

});


module.exports = router;