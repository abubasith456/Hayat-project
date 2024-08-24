var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const port = 8080; // Replace with your desired port
const server = http.createServer(app);
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.error('MongoDB connection error:', error));

mongoose.Promise = global.Promise;

server.listen(port, function () {
  console.log('Server is started on http://127.0.0.1:' + port);
});
