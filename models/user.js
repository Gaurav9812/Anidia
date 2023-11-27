const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const MANUAL="MANUAL";
const GOOGLE="GOOGLE";

const userSchema = new mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                 required: function(){
                    this.signUpFrom == MANUAL
                }
            },
            lastName: {
                type: String,
                required: function(){
                    this.signUpFrom == MANUAL
                }
            }
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        dateOfBirth: {
            type: Date,
            required: function(){
                this.signUpFrom == MANUAL
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        emailVerified: {
            type: Boolean,
            default:false
        },
        socialMediaUniqueId: {
            type: String,
        },
        passwordHash: {
            type: String,
            required: function(){
                this.signUpFrom == MANUAL
            }
        },
        avtar: {
            type: String
        },
        signUpFrom :{
            type: String,
            enum:['MANUAL','GOOGLE']
        },
        randomHash:{
            type:String,
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
module.exports.MANUAL = MANUAL;

module.exports.GOOGLE = GOOGLE ;
