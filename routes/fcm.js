var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');
var serverKey = 'AAAAKXRRooI:APA91bH9pMJziYPRNRI2XyMaSIG_e5a-eJzxMSkaozaCrmCencitDrTul4XyrVAV87K6d-56zGJC49y7Cz6mTRpcxca16QzmF1TF8EW7OmxHPvcQdseHWoD3TIAe62u2gfY0pVXlhJ8Y'
var fcm = new FCM(serverKey);
var User = require('../models/user');
const { successResponse, failedResponse } = require('../utils/responseModel');
// const admin = require('firebase-admin');
const admin = require("../utils/firebase")

// Initialize the Firebase Admin SDK (replace with your credentials)
// admin.initializeApp({
//     credential: admin.credential.cert(require('../push-notification-key.json'))
//   });

router.post('/pushToken', async function (req, res) {
    var unique_idValue = req.body.unique_id;
    var pushTokenValue = req.body.pushToken;
    try {
        const data = await User.findOne({ unique_id: unique_idValue });
        if (data) {
            User.updateOne({
                unique_id
                    : data.unique_id
            }, {
                $set: {
                    pushToken: pushTokenValue
                }
            }).exec()
                .then(result => {
                    res.status(200).send(successResponse("Push token updated."));
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        } else {
            res.status(201).send(failedResponse("User not found!"));
        }
    } catch (e) {
        res.status(500).send(failedResponse(e));
    }
});



router.post('/push', async (req, res) => {
    try {
        const deviceToken = req.body.deviceToken;
        const title = req.body.title;
        const bodyText = req.body.bodyText;

        const message = {
            token: deviceToken,
            notification: {
                title: title,
                body: bodyText,
            },
            android: {
                priority: "high",
            },
        };

        // Send message via Firebase Admin SDK
        const response = await admin.messaging().send(message);
        res.status(200).send(response);
    } catch (err) {
        res.status(400).send("Something has gone wrong! => " + err.message);
        console.error("Error sending message:", err);
    }
});

module.exports = router;