const { uploadFile } = require("../../config/firebaseConfig");
/**
* @Post {mongoose.SchemaDefinitionProperty}
*/
const Post = require("../../models/Post");
const User = require("../../models/user");

module.exports.AddPost = async function(req,res){
    let user = await User.findById(req.user.id);
    let post = new Post();
    
    const {content} = req.body;
    let file = req.file;
    if(user){
        
       try{
        
        post.content = content;
        if(file){
            const downloadUrl = await uploadFile(file,'post/',user);
            post.photo = downloadUrl    
        }
        post.user = user._id;

        post = await post.save();
        if(post){
            return res.status(200).json({
                status:200,
                user:user,
                message:'Post Added',
            })
        }else{
            console.log(post);
        }
        
       }catch(err){
        
            return res.status(200).json({
                status:500,
                message:err.message
            })
       }
        
    }
}

module.exports.GetPost = async function (req,res){
    if(req.params.userId){
        const posts =await Post.find().where({user:req.params.userId}).populate('user',['name','profilePhoto']).exec();
        return res.status(200).json({
            status:200,
            posts:posts,
            message:"User Id not found",

    });
    }

    
    return res.status(200).json({
            status:400,
            message:"User Id not found",

    });
    
    
}