var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');
var serverKey = 'AAAAKXRRooI:APA91bH9pMJziYPRNRI2XyMaSIG_e5a-eJzxMSkaozaCrmCencitDrTul4XyrVAV87K6d-56zGJC49y7Cz6mTRpcxca16QzmF1TF8EW7OmxHPvcQdseHWoD3TIAe62u2gfY0pVXlhJ8Y'
var fcm = new FCM(serverKey);



router.post('pushToken', function (req, res) {



});



router.post('push', function (req, res) {

    var deviceToken = req.deviceToken;
    var title = req.title;
    var body = req.title;

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: deviceToken,

        notification: {
            title: title,
            body: body,
        },

        // data: {  //you can send only notification or only data(or include both)
        //     my_key: 'my value',
        //     my_another_key: 'my another value'
        // }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            res.send("Something has gone wrong!");
            console.log("Something has gone wrong!");
        } else {
            console.log();
            res.send("Successfully sent with response: ", response);
        }
    });

});

module.exports = router;