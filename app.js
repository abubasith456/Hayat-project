var express = require('express');
var router = express.Router();
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const morgan = require('morgan');



//Routes
const login = require("./routes/login");
const register = require("./routes/register");
const profile = require("./routes/profile");
const productRoutes = require("./routes/products");
const profileUpdate = require("./routes/profileUpdate");

//Mongoes Db
mongoose.connect('mongodb+srv://basith:basith@cluster0.fhejr.mongodb.net/RegisterLogin?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, (err) => {
	if (!err) {
		console.log('MongoDB Connection Succeeded.');
	} else {
		console.log('Error in DB connection : ' + err);
	}
});

mongoose.Promise = global.Promise;


//Setting the requestParse
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//IDK why we use this and i think this is Header what required....
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

// Routes which should handle requests
app.use("/login", login);
app.use("/register", register);
app.use("/profile", profile);
app.use("/profileUpdate", profileUpdate);
app.use("/products", productRoutes);


//Error catch
app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

//Some other error show
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;


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