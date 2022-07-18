const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');
var User = require('../models/user');

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

var otp = Math.random();
otp = otp * 10000;
otp = parseInt(otp);

console.log(otp);


// let transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     service: 'gmail',
//     port: 587,
//     auth: {
//         user: "hayatstore200@gmail.com",
//         pass: "abubasith86"
//     },
//     secure: true,
//     secureConnection: 'false',
//     tls: {
//         ciphers: 'SSLv3'
//     }
// });

var transporter = nodemailer.createTransport({

    service: 'gmail',

    // auth: {
    //     user: 'hayatstore200@gmail.com', // here use your real email
    //     pass: 'okgztdbrpskasxpv' // put your password correctly (not in this question please)
    // }

    auth: {
        user: 'abubasith456@gmail.com', // here use your real email
        pass: 'vmllbwfiehtqaeep' // put your password correctly (not in this question please)
    }
});

router.post('/', async (req, res, next) => {
    try {
        var email = req.body.email;
        console.log(email);

        User.findOne({ email: email }, function (err, data) {
            console.log(data);
            if (data) {
                var mailOptions = {
                    priority: "high",
                    from: 'hayatstore@gmail.com',
                    to: 'abubasith143@gmail.com ',
                    subject: `OTP for frogot password`,
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                       <div style="margin:50px auto;width:70%;padding:20px 0">
                         <div style="border-bottom:1px solid #eee">
                           <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hayat Store</a>
                         </div>
                         <p style="font-size:1.1em">Hi ${data.username},</p>
                         <p>Thank you for choosing the Hayat. Use the following OTP to complete your forgot password procedures. OTP is valid for 5 minutes</p>
                         <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                         <p style="font-size:0.9em;">Regards,<br />Hayat Store</p>
                         <hr style="border:none;border-top:1px solid #eee" />
                         <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                           <p>Hayat Store Inc</p>
                           <p>Tamil Nadu,</p>
                           <p>Nagapattinum dt,</p>
                           <p>Enangudi.</p>
                         </div>
                       </div>
                     </div>` // html body
                };
                console.log(mailOptions);
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.send(failedResponse(error));
                        console.log('Error found' + error);
                    } else {
                        res.send(successResponse("OTP sent to your email!"));
                    }
                    // console.log('Message sent: %s', info.messageId);
                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // console.log('Info found' + info);

                });

            } else {
                res.send(failedResponse("Invalid user!"))
            }
        }).catch(err => {
            console.log(err.message);
            res.send(failedResponse(err))
        });

    } catch (error) {
        res.send(failedResponse(err));
    }


});

router.post('/verify', async (req, res, next) => {
    try {
        console.log(req.body.otp)
        if (req.body.otp == otp) {
            res.send(successResponse("Verified successfully!"))
            otp = 0;
        }
        else {
            res.send(failedResponse("Invalid OTP!"));
        }
    }
    catch (err) {
        res.send(failedResponse(err));
    }
});


router.post('/resend', function (req, res) {
    try {
        var email = req.body.email;
        console.log(email);

        User.findOne({ email: email }, function (err, data) {
            console.log(data);
            if (data) {
                var mailOptions = {
                    priority: "high",
                    from: 'hayatstore@gmail.com',
                    to: 'abubasith143@gmail.com ',
                    subject: `OTP for frogot password`,
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                       <div style="margin:50px auto;width:70%;padding:20px 0">
                         <div style="border-bottom:1px solid #eee">
                           <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hayat Store</a>
                         </div>
                         <p style="font-size:1.1em">Hi ${data.username},</p>
                         <p>Thank you for choosing the Hayat. Use the following OTP to complete your forgot password procedures. OTP is valid for 5 minutes</p>
                         <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                         <p style="font-size:0.9em;">Regards,<br />Hayat Store</p>
                         <hr style="border:none;border-top:1px solid #eee" />
                         <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                           <p>Hayat Store Inc</p>
                           <p>Tamil Nadu,</p>
                           <p>Nagapattinum dt,</p>
                           <p>Enangudi.</p>
                         </div>
                       </div>
                     </div>` // html body
                };
                console.log(mailOptions);
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.send(failedResponse(error));
                        console.log('Error found' + error);
                    } else {
                        res.send(successResponse("OTP sent to your email!"));
                    }
                    // console.log('Message sent: %s', info.messageId);
                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // console.log('Info found' + info);
                });

            } else {
                res.send(failedResponse("Invalid user!"))
            }
        }).catch(err => {
            console.log(err.message);
            res.send(failedResponse(err))
        });

    } catch (error) {
        res.send(failedResponse(err));
    }


});


module.exports = router;