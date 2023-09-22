const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports.create = async function (req, res) {
    console.log(req.params.postId);
    try {
        let post = await Post.findById(req.params.postId);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.params.postId
            });
            if (comment) {
                console.log("Successfully created comment");
                post.comments.push(comment);
                post.save();
            } 
      req.flash('success',"Comment Added successfully");

            return res.redirect("back");
        }
    } catch(err){
      req.flash('error',"Error while Adding comment");

        console.log(err);
        return ;
    }
    
};

module.exports.deleteComment = async function (req, res) {
    let commentId = req.params.commentId;
    try{

        let comment = await Comment.findById(commentId);
        if (comment && comment.user == req.user.id) {
            comment.remove();
           let post = await Post.findByIdAndUpdate(comment.post,{$pull:{comments:commentId}});
           req.flash('success',"Comment removed");
            
        } else{
            req.flash('info',"You are not authorized to delete this comment");
                      
        }
        return res.redirect("back");
    } catch(err){
        console.log(err)
        req.flash('error',"Error while removing comment "+err.message);

        return;
    }

}