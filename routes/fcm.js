var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');
var serverKey = 'AAAAKXRRooI:APA91bH9pMJziYPRNRI2XyMaSIG_e5a-eJzxMSkaozaCrmCencitDrTul4XyrVAV87K6d-56zGJC49y7Cz6mTRpcxca16QzmF1TF8EW7OmxHPvcQdseHWoD3TIAe62u2gfY0pVXlhJ8Y'
var fcm = new FCM(serverKey);
var User = require('../models/user');

function Response(errorCode, message) {
    return {
        "status": errorCode,
        "connection": "Connected",
        "message": message,
        "userData": {

        }
    }
}

router.post('/pushToken', async function (req, res) {


    var unique_idValue = req.body.unique_id;
    var pushTokenValue = req.body.pushToken;

    User.findOne({ unique_id: unique_idValue }, function (err, data) {
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

                    res.send(Response(200, "Push token updated...."));

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        } else {
            res.send(Response(400, "user not found!"));
        }
    });



});



router.post('/push', function (req, res) {

    console.log(req);

    var deviceToken = req.body.deviceToken;
    var title = req.body.title;
    var bodyText = req.body.bodyText;

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: deviceToken,

        notification: {
            title: title,
            body: bodyText,
        },

        // data: {  //you can send only notification or only data(or include both)
        //     my_key: 'my value',
        //     my_another_key: 'my another value'
        // }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            res.status(400).send("Something has gone wrong! => " + err);
            console.log("Something has gone wrong! " + err);
        } else {
            console.log();
            res.status(200).send(response);
        }
    });

});

module.exports = router;