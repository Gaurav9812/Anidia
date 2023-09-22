const multer = require('multer');
const  { storage }= require('../config/middleware')
const User = require('../models/user');
const upload = multer({ storage: User.storage });

module.exports.home = function(req,res){

    res.render('profile');
}



module.exports.uploadAvtar = function(req,res){
    console.log("Hello world!");
    console.log(storage);
    try {

        upload.single('avtar')(req,res, function(err){
            console.log(err);
            console.log(req.file);
        });
       
       

    }catch(err){
        console.log(err)
    }

}