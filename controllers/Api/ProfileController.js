
const { use } = require("passport");
const User = require("../../models/user");
const { getFileName } = require("../../utils");
const { initializeApp } = require("firebase/app");
const firebaseConfig = require('../../config/firebaseConfig');
const {getStorage,getDownloadURL, ref, uploadBytesResumable} = require('firebase/storage');
const fs = require('fs');

module.exports.uploadPhoto=async function (req,res){
    let user = await User.findById(req.user.id);
    
    const {field} = req.body;
    let file = req.file;
    if(user && file){
        
       try{
        
        const metaData = {
                contentType:file.mimetype
        };
        
        const app = initializeApp(firebaseConfig);
          const storage =  getStorage();
          const imageRef = ref(storage,'files/'+user.createFileName({
            fieldName:file.fieldname,
            mimetype:file.mimetype
          }));
          const task = await uploadBytesResumable(imageRef,file.buffer,metaData);
          
          const downloadUrl = await getDownloadURL(task.ref);
          
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

