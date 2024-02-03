
const { use } = require("passport");
const User = require("../../models/user");

const fs = require('fs');
const { uploadFile } = require("../../config/firebaseConfig");

module.exports.uploadPhoto=async function (req,res){
    let user = await User.findById(req.user.id);
    
    const {field} = req.body;
    let file = req.file;
    if(user && file){
        
       try{
      
        const downloadUrl = await uploadFile(file,'',user);
          if(field == 'cover_photo'){
            user.coverPhoto = downloadUrl;
          }else if(field=='profile_photo'){
            user.profilePhoto = downloadUrl;
          }
        
        user = await user.save();

        return res.status(200).json({
            status:200,
            user:user,
            message:'cover photo updated',
        })
       }catch(err){
        
            return res.status(200).json({
                status:500,
                message:err.message
            })
       }
        
    }
}


module.exports.updateBio=async function (req,res){
  let user = await User.findById(req.user.id);
  
  const {bio} = req.body;
  
  if(user ){
      
     try{
      
      user.bio = bio;
      user = await user.save();
      
      return res.status(200).json({
          status:200,
          user:user,
          message:'Bio updated',
      })
     }catch(err){
      
          return res.status(200).json({
              status:500,
              message:err.message
          })
     }
      
  }
}

module.exports.updateBio=async function (req,res){
  let user = await User.findById(req.user.id);
  
  const {skills} = req.body;
  
  if(user ){
      
     try{
      
      user.skills = skills;
      user = await user.save();
      
      
      return res.status(200).json({
          status:200,
          user:user,
          message:'skills updated',
      })
     }catch(err){
      
          return res.status(200).json({
              status:500,
              message:err.message
          })
     }
      
  }
}

