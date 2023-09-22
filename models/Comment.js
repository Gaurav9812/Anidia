const Mongoose = require("mongoose");

const commentSchema = Mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        post: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    },
    {
        timestamps: true
    }
);

const Comment = Mongoose.model("Comment", commentSchema);

module.exports = Comment;
