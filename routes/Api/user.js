const express = require("express");
const ROUTER = express.Router();
// const passport = require("passport");

const passport = require("passport");

const UserController = require("../../controllers/Api/UserController");

ROUTER.get("/login", UserController.logIn);

ROUTER.get("/signup", UserController.signUp);

//Create User
ROUTER.post("/create-user", UserController.createUser);

ROUTER.post(
    "/create-session",
    passport.authenticate("local", { failureRedirect: "/login" }),
    UserController.createSession
);

ROUTER.get("/destroy-session", UserController.destroySession);

module.exports = ROUTER;
