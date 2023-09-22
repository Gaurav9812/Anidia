const { Router } = require("express");
const express = require("express");
const ROUTER = express.Router();
const passport = require("passport");

const postController = require("../controllers/PostController");

ROUTER.post("/create", passport.checkAuthentication, postController.create);

ROUTER.get("/delete/:postId", passport.checkAuthentication, postController.deletePost);


module.exports = ROUTER;
