const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const userSchema = new mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            }
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        avtar: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.statics.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("hea");
        cb(null, path.join(__dirname + "/../uploads/users/avtars"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
    }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
