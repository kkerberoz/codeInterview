const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { ATLAS_URI } = process.env;

const mongoUri = ATLAS_URI || "mongodb://db:27017/interview";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());

// Set up Mongoose
mongoose
  .connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() =>
    console.log("MongoDB database connection established successfully!")
  )
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

//routes
app.use("/", require("../routes/authRoutes"));
app.use("/", require("../routes/postRoutes"));
//not found route
app.use(function (req, res) {
  res.send({ error: "Route is not found" }, 404);
});

module.exports = app;
