var express = require('express');
var router = express.Router();
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

function profileResponse(message, statusCode, dataJson) {
	return [
		{
			"status": statusCode,
			"connection": "Connected",
			"message": message
		},
		dataJson
	]
}

//To check the connection connected or not
router.get('/', function (req, res, next) {
	// return res.render('index.ejs');
	return res.json(successResponse("Success"))
},
	e => res.json(failedResponse(e))
);

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
							password: password,
							passwordConf: value.passwordConf
						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send(successResponse('Success'));
				} else {
					res.send(failedResponse('Email is already used'));
				}

			});
		} else {
			res.send(failedResponse('password is not matched'));
		}
	}
});


//Login connection check
router.get('/login', function (req, res, next) {
	// return res.render('login.ejs');
	return res.json(successResponse("Success"))
},
	e => res.json(failedResponse(e))
);

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
					//console.log("Done Login");
					req.session.userId = data.unique_id;
					//console.log(req.session.userId);
					res.send(successResponse('Success'));
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
router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			// res.redirect('/');
			res.send(failedResponse('Session expired!'))
		} else {
			//console.log("found");
			// return res.render('data.ejs', { "name": data.username, "email": data.email });
			var dataJson = {
				"username": data.username, "email": data.email
			}
			res.send(profileResponse('Success', 200, dataJson))


		}
	});
});


//Logout the user
router.get('/logout', function (req, res, next) {
	console.log("logout")
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


router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});


//Forgotpassword
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

module.exports = router;