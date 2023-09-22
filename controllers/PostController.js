const Post = require("../models/Post");
const Comment = require("../models/Comment");
module.exports.create = async function (req, res) {
  try {

    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    if (post) {
      req.flash('success',"Post Added successfully");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    req.flash('error',"Error creating post");
    return res.redirect("back");
  
  }
};

module.exports.deletePost = async function (req, res) {
  const postId = req.params.postId;
  try{
    let post = await Post.findById(postId);
    if(post && post.user == req.user.id) {
        post.remove();
    
    await Comment.deleteMany({
      post: postId,
    });
  }
  req.flash('success',"Post Removed successfully");

    return res.redirect("back");
  } catch(err){
    req.flash('error',"Error while removing ");

    console.log(err)
    return;
  }


};
