var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post('/logout', function (req, res, next) {

    var session = {
        "cookie": {
            path: '/', _expires: null,
            originalMaxAge: null,
            httpOnly: true
        },
        userId: req.body.user_id
    }
    console.log(session)

    if (session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return res.send(failedResponse("Logout failed!"))

            } else {
                return res.send(successResponse('Logout success'));

            }
        });
        req.session.destroy;
    }
});

module.exports = router;