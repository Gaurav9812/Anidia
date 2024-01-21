const multer = require("multer");
const User = require("../../models/user");


const upload = multer({storage:User.storage});


module.exports.uploadPhoto=async function (req,res){
    
    console.log(req.file,req.body);
}