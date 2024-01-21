const express = require('express');
const ROUTER = express.Router();

const ProfileController=  require('../../controllers/Api/ProfileController');
const multer = require('multer');
const User = require('../../models/user');
const upload = multer({dest:'uploads/', onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },});

ROUTER.post('/upload-photo',upload.single('file'),ProfileController.uploadPhoto)


module.exports = ROUTER;