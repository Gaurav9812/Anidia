const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/authentication");

const db = mongoose.connection;

db.on("error", function (err) {
  if (err) {
    console.log(err.message);
  }
});

db.once("open", function () {
  console.log("Successfully connected to the database");
});
