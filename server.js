const express = require("express");
const { bootstrap } = require("./bootstrap.js")
const { dbConnection } = require("./Database/DbConnection.js")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")


dotenv.config();
const app = express();
app.use(cors())

dbConnection();

const port = 4000;
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("uploads"));

bootstrap(app);
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));
