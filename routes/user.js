const express = require("express");
const ROUTER = express.Router();
// const passport = require("passport");

const passport = require("passport");

const UserController = require("../controllers/UserController");

ROUTER.get("/login", UserController.logIn);

ROUTER.get("/signup", UserController.signUp);

ROUTER.post("/create-user", UserController.createUser);

ROUTER.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/login" }),
  UserController.createSession
);

ROUTER.get("/destroy-session", UserController.destroySession);

module.exports = ROUTER;
