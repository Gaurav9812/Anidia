const Post = require("../models/Post");

module.exports.home = async function (req, res) {
    let posts = await Post.find({})
        .populate("user")
        .populate({
            path: "comments",
            populate: {
                path: "user"
            }
        })
        .exec();
        console.log(posts);

    return res.render("home.ejs", {
        posts: posts
    });
};
