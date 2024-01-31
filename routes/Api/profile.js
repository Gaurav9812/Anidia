const express = require("express");
const ROUTER = express.Router();

const ProfileController = require("../../controllers/Api/ProfileController");
const multer = require("multer");
const User = require("../../models/user");
const upload = multer({
  storage:User.memoryStorage 
});

ROUTER.post(
    "/upload-photo",
    upload.single("cover_photo"),
    ProfileController.uploadPhoto
);

ROUTER.post(
  "/update-bio",
  ProfileController.updateBio
);


module.exports = ROUTER;
