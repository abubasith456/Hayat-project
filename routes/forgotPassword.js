const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');
var User = require('../models/user');
const { successResponse, failedResponse } = require("../utils/responseModel");

var otp = Math.random();
otp = otp * 10000;
otp = parseInt(otp);


var transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: 'abubasith456@gmail.com', // here use your real email
        pass: 'vmllbwfiehtqaeep' // put your password correctly (not in this question please)
    }
});

router.post('/', async (req, res, next) => {
    try {
        var email = req.body.email;
        console.log(email);

        var newOtpValue = Math.floor(1000 + Math.random() * 9000);

        const data = await User.findOne({ email: email });

        if (data) {
            console.log(data);
            //find the user using unique id for update token.
            User.updateOne({
                unique_id
                    : data.unique_id
            }, {
                $set: {
                    token: newOtpValue
                }
            }).exec()
                .then(result => {
                    //Generate Main formate how you send.
                    var mailOptions = {
                        priority: "high",
                        from: 'hayatstore200@gmail.com',
                        to: email,
                        subject: `OTP for frogot password`,
                        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                           <div style="margin:50px auto;width:70%;padding:20px 0">
                             <div style="border-bottom:1px solid #eee">
                               <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hayat Store</a>
                             </div>
                             <p style="font-size:1.1em">Hi ${data.username},</p>
                             <p>Thank you for choosing the Hayat. Use the following OTP to complete your forgot password procedures. OTP is valid for 2 minutes</p>
                             <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${newOtpValue}</h2>
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
                            res.status(201).send(failedResponse(error));
                            console.log('Error found' + error);
                        } else {
                            //Success message
                            res.status(200).send(successResponse("OTP sent to your email!"));
                            console.log('');
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });



        } else {
            res.send(failedResponse("Invalid user!"))
        }

    } catch (error) {
        res.status(500).send(failedResponse(error));
    }

});


//Verify the otp
router.post('/verify', async (req, res, next) => {
    try {
        var email = req.body.email;
        console.log(req.body.otp)

        const data = await User.findOne({ email: email });
        if (data) {
            if (data.token == req.body.otp) {

                User.updateOne({
                    unique_id
                        : data.unique_id
                }, {
                    $set: {
                        token: ""
                    }
                }).exec()
                    .then(result => {
                        res.send(successResponse("Verified successfully!"))
                    });
                otp = 0;

            }
            else {
                res.send(failedResponse("Invalid OTP!"));
            }
        } else {
            res.send(failedResponse("Data not found!"));
        }

    } catch (err) {
        res.send(failedResponse(err));
    }
});


//Resend the otp
router.post('/resend', async function (req, res) {
    try {
        var email = req.body.email;
        console.log(email);
        var newOtpValue = Math.floor(1000 + Math.random() * 9000);

        const data = await User.findOne({ email: email });

        if (data) {
            console.log(data);
            //find the user using unique id for update token.
            User.updateOne({
                unique_id
                    : data.unique_id
            }, {
                $set: {
                    token: newOtpValue
                }
            }).exec()
                .then(result => {
                    //Generate Main formate how you send.
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
                             <p>Thank you for choosing the Hayat. Use the following OTP to complete your forgot password procedures. OTP is valid for 1 minutes</p>
                             <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${newOtpValue}</h2>
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
                            res.status(400).send(failedResponse(error));
                            console.log('Error found' + error);
                        } else {
                            //Success message
                            res.send(successResponse("OTP sent to your email!"));
                            console.log('OTP sent to your email!');
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        } else {
            res.status(400).send(failedResponse("Invalid user!"))
        }

    } catch (error) {
        res.status(400).send(failedResponse(err));
    }

});


module.exports = router;