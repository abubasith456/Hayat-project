// var express = require('express');
// var env = require('dotenv').config()
// var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);

const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:' + PORT);
});

// mongoose.connect('mongodb+srv://basith:basith@cluster0.fhejr.mongodb.net/RegisterLogin?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }, (err) => {
//   if (!err) {
//     console.log('MongoDB Connection Succeeded.');
//   } else {
//     console.log('Error in DB connection : ' + err);
//   }
// });

// mongoose.Promise = global.Promise;

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
// });
// db.close

// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: false,
//   // store: new MongoStore({
//   //   mongooseConnection: db
//   // })
// }));
// // app.use(new MongoStore({ mongooseConnection: db }));
// // app.set('views', path.join(__dirname, 'views'));
// // app.set('view engine', 'ejs');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // app.use(express.static(__dirname + '/views'));

// var index = require('./index');
// app.use('/', index);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// // define as the last app.use callback
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message);
// });

// app.listen(PORT, function () {
//   console.log('Server is started on http://127.0.0.1:' + PORT);
// });
