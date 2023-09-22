const { Router } = require("express");
const express = require("express");
const ROUTER = express.Router();
const passport = require("passport");

const ProfileController = require("../controllers/ProfileController");

ROUTER.get("/", passport.checkAuthentication, ProfileController.home);

ROUTER.post("/upload-avtar", passport.checkAuthentication, ProfileController.uploadAvtar);



module.exports = ROUTER;
