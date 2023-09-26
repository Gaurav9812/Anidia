const express = require("express");
const ROUTER = express.Router();
// const passport = require("passport");

const passport = require("passport");
const HomeController = require("../../controllers/HomeController");

ROUTER.get("/", HomeController.home);

ROUTER.use("/user", require("./user"));

// ROUTER.use("/post", require("./post"));

// ROUTER.use("/comment", require("./comment"));

// ROUTER.use("/profile", require("./profile"));

module.exports = ROUTER;
