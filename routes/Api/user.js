const express = require("express");
const ROUTER = express.Router();
// const passport = require("passport");

const passport = require("passport");

const UserController = require("../../controllers/Api/UserController");

ROUTER.post("/login-google", UserController.logIn);

ROUTER.get("/login/:token", UserController.createSessionUsingToken);

ROUTER.get("/signup", UserController.signUp);

ROUTER.get('/verify-email/:hash',UserController.verifyEmail);

ROUTER.post('/forgot-password',UserController.forgotPassword);

ROUTER.post('/reset-password/:hash',UserController.resetPassword);

ROUTER.get('/get-user',passport.authenticate('jwt',{session:false}),UserController.getUser)
//Create User
ROUTER.post("/create-user", UserController.createUser);

ROUTER.post(
    "/create-session",
    UserController.createSession
);

ROUTER.get("/destroy-session", UserController.destroySession);

module.exports = ROUTER;
