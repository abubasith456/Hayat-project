const mongoose = require("mongoose")
require('dotenv').config();

const musfiCollection = 'mongodb+srv://abu:Abubasith86@musficollection.rlzbs.mongodb.net/?retryWrites=true&w=majority&appName=musficollection'

const hayatCollections = 'mongodb+srv://basith:basith@cluster0.fhejr.mongodb.net/RegisterLogin?retryWrites=true&w=majority'

function dbConnection() {
  mongoose
    .connect(musfiCollection)
    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}

module.exports = {dbConnection}