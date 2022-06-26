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

