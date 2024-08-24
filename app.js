var express = require('express');
var router = express.Router();
var app = express();
const http = require('http');
var bodyParser = require('body-parser');
const morgan = require('morgan');


//Routes
const login = require("./routes/login");
const register = require("./routes/register");
const profile = require("./routes/profile");
const profileUpdate = require("./routes/profileUpdate");
const changePassword = require("./routes/changePassword");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const category = require("./routes/category");
const vegetables = require("./routes/vegetables");
const grocery = require("./routes/grocery");
const drinks = require("./routes/drinks");
const fruites = require("./routes/fruits");
const dairy = require("./routes/dairy");
const forgotPassword = require("./routes/forgotPassword")
const fcm = require("./routes/fcm");
const banner = require("./routes/banner");
const address = require("./routes/address")
const firebase = require("./utils/firebase")
const post = require("./routes/post")
const newPost = require("./routes/newPost");
const comment = require("./routes/cmd");
const personalCare = require("./routes/personalCare");
const healthCare = require("./routes/healthCare");
const driedNoodles = require("./routes/driedNoodles");
const home = require("./routes/home")
const babyItems = require("./routes/babyItems")

// //Mongoes Db
// mongoose.connect('mongodb+srv://basith:basith@cluster0.fhejr.mongodb.net/RegisterLogin?retryWrites=true&w=majority', {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// }, (err) => {
// 	if (!err) {
// 		console.log('MongoDB Connection Succeeded.');
// 	} else {
// 		console.log('Error in DB connection : ' + err);
// 	}
// });

// mongoose.Promise = global.Promise;


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
app.use("/category", category);
app.use("/orders", orderRoutes);
app.use("/vegetables", vegetables);
app.use("/grocery", grocery);
app.use("/fruits", fruites);
app.use("/drinks", drinks);
app.use("/dairy", dairy);
app.use("/forgotPassword", forgotPassword);
app.use("/changePassword", changePassword);
app.use("/fcm", fcm);
app.use("/banner", banner);
app.use("/address", address);
app.use("/newPost", newPost);
app.use("/cmd", comment);
app.use("/personalCare", personalCare);
app.use("/healthCare", healthCare);
app.use("/driedNoodles", driedNoodles);
app.use("/home", home)
app.use("/babyItems", babyItems)


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