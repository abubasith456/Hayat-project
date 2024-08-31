var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const { successResponse, failedResponse } = require('../utils/responseModel');

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
    console.log(updateOps);
    try {
        const { email } = req.body;
        // Find the user by email
        const user = await User.findOne({ email: email }).exec();

        if (user) {
            // Update the user's password
            await User.updateOne({ email: user.email }, { $set: updateOps }).exec();
            res.status(200).send(successResponse("Password changed successfully!"));
        } else {
            res.status(400).send(failedResponse("Email not registered!", 400));
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(failedResponse(err.message, 500));
    }

    // }
    //  else {
    //     res.send(failedResponse("Password not matched"));
    // }

});


module.exports = router;