const { Router } = require("express");
const express = require("express");
const ROUTER = express.Router();
const passport = require("passport");

const commentController = require("../controllers/CommentController");

ROUTER.post(
    "/create/:postId",
    passport.checkAuthentication,
    commentController.create
);

ROUTER.get(
    "/delete/:commentId",
    passport.checkAuthentication,
    commentController.deleteComment
);

module.exports = ROUTER;
