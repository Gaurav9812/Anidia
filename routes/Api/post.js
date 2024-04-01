const express = require('express');
const User = require('../../models/user');
const multer = require('multer');
const ROUTER = express.Router();

const PostConroller = require('../../controllers/Api/PostController');
const upload = multer({
    storage:User.memoryStorage 
  });
  
ROUTER.post(
    "/add-post",
    upload.single("post"),
    PostConroller.AddPost
);

ROUTER.get(
  "/get-post/:userId",
  PostConroller.GetPost
);

module.exports = ROUTER;