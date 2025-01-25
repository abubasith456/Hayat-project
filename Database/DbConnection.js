const mongoose = require("mongoose")
require('dotenv').config();

const musfiCollection = 'mongodb+srv://abu:Abubasith86@musficollection.rlzbs.mongodb.net/?retryWrites=true&w=majority&appName=musficollection'

const hayatCollections = 'mongodb+srv://basith:basith@cluster0.fhejr.mongodb.net/RegisterLogin?retryWrites=true&w=majority'

function dbConnection() {
  mongoose.connect(musfiCollection, {
    connectTimeoutMS: 30000, // Set a custom timeout (default is 30,000 ms)
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.error('MongoDB connection error:', error));

mongoose.Promise = global.Promise;
}

module.exports = {dbConnection}