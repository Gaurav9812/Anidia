const express = require("express");
const ROUTER = express.Router();

const passport = require("passport");
const HomeController = require("../../controllers/HomeController");

ROUTER.get("/", HomeController.home);

ROUTER.use("/user", require("./user"));

ROUTER.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  ROUTER.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// ROUTER.use("/post", require("./post"));

// ROUTER.use("/comment", require("./comment"));

// ROUTER.use("/profile", require("./profile"));

module.exports = ROUTER;
