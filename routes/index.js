var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

function profileResponse(message, statusCode, data) {
	return {
		"status": statusCode,
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

//to register the user
router.post('/register', async function (req, res, next) {

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

//Login user
router.post('/login', async function (req, res, next) {

	var value = req.body;

	if (!value.email || !value.password) {
		res.status('Please give the all information')
	} else {
		User.findOne({ email: value.email }, async function (err, data) {
			if (data) {

				//Validate password.
				const validPassword = await bcrypt.compare(value.password, data.password);

				if (validPassword) {

					req.session.userId = data.unique_id;
					//console.log(req.session.userId);

					var data = {
						"status": 200,
						"connection": "Connected",
						"message": "Login success",
						"userData": {
							"user_id": data.unique_id,
							"username": data.username,
							"email": data.email,
							"dateOfBirth": data.dateOfBirth,
							"mobileNumber": data.mobileNumber
						}
					}
					// res.send(profileResponse('Login Success', 200, data));
					res.send(data);
				} else {
					res.send(failedResponse('Wrong password!'));
				}
			} else {
				res.send(failedResponse('This Email Is not regestered!'));
			}
		});
	}

});

//Watch your profile
router.post('/profile', function (req, res, next) {

	var session = {
		"cookie": {
			path: '/', _expires: null,
			originalMaxAge: null,
			httpOnly: true
		},
		userId: req.body.user_id
	}

	User.findOne({ unique_id: session.userId }, function (err, data) {

		if (!data) {
			// res.redirect('/');
			res.send(failedResponse('Data not found!'))
		} else {
			//console.log("found");
			// return res.render('data.ejs', { "name": data.username, "email": data.email });
			// var dataJson = {
			// 	"username": data.username,
			// 	"email": data.email,
			// 	"dateOfBirth": data.dateOfBirth,
			// 	"mobileNumber": data.mobileNumber
			// }
			res.send(profileResponse('Success', 200, data))

		}
	});
});

//Logout the user
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

	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

//Forgot password
router.post('/forgetpass', function (req, res, next) {

	var value = req.body;

	if (!value.email || !value.password || !value.passwordConf) {

		res.status('Please give the all information')

	} else {

		User.findOne({ email: value.email }, function (err, data) {
			console.log(data);
			if (!data) {
				res.send(failedResponse('Email not registerd!'));
			} else {

				if (value.password == value.passwordConf) {
					data.password = value.password;
					data.passwordConf = value.passwordConf;

					data.save(function (err, Person) {
						if (err) {
							console.log(err);
						}
						else {
							console.log('Forgot Success');
							res.send(successResponse('Password changed!'));
						}
					});
				} else {
					res.send(failedResponse('Password does not matched! Both Password should be same'));
				}
			}
		});
	}
});

//Update profile
router.post('/update', async function (req, res, next) {

	var session = {
		"cookie": {
			path: '/', _expires: null,
			originalMaxAge: null,
			httpOnly: true
		},
		userId: req.body.user_id
	}

	console.log(session.userId);

	User.findOne({ unique_id: session.userId }, function (err, data) {
		// console.log("data");
		if (!data) {
			res.send(failedResponse('Session expired!'))
		} else {

			data.username = req.body.username;
			data.dateOfBirth = req.body.dateOfBirth;
			data.mobileNumber = req.body.mobileNumber;

			data.save(function (err, Person) {
				if (err) {
					console.log(err);
					res.send(failedResponse(err))
				}
				else {
					console.log('Update successs');
					res.send(successResponse('Profile updated!'));
				}
			})
		}

	});

});

module.exports = router;


//To check the connection connected or not
// router.get('/', function (req, res, next) {
// 	// return res.render('index.ejs');
// 	return res.json(successResponse("Success"))
// },
// 	e => res.json(failedResponse(e))
// );

//Forgot password
// router.get('/forgetpass', function (req, res, next) {
// 	res.render("forget.ejs");
// });

//Login connection check
// router.get('/login', function (req, res, next) {
// 	// return res.render('login.ejs');
// 	return res.json(successResponse("Success"))
// },
// 	e => res.json(failedResponse(e))
// );