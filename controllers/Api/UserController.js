const Crypto = require("crypto-js");
const { Passport, use } = require("passport");
const User = require("../../models/user");
const jwt = require('jsonwebtoken');
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("signup");
};

module.exports.logIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }

    return res.render("login");
};

module.exports.createUser = async function (req, res) {
    const {
        firstName,
        lastName,
        dob,
        day,
        month,
        year,
        email,
        password,
        confirmPassword,
        username
    } = req.body;
    // console.log("BODY ", req.body);
    // return;
    let dobR = new Date(`${year}-${month}-${day}`);
    if (password === confirmPassword) {
        try {
            let passwordHash = Crypto.SHA256(password);
            
            let user = await User.create({
                name: {
                    firstName: firstName,
                    lastName: lastName
                },
                email: email,
                username: username,
                dateOfBirth: dob ? dob : dobR,
                passwordHash: passwordHash
            });
            if (user) {
                return res.status(200).json({
                    message: "User created successfully"
                });
            } else {
                return res.status(409).json({
                    message: "User with same email and username Alredy Exist!"
                });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    return res.status(400).json({
        message: "Password and confirm password are not same"
    });
};

module.exports.createSession = async function (req, res) {
   
        const {
            username,password
          } = req.body;
          console.log(username,password);
          if(username && password){
              let user = await User.findOne({username:username});
              if(user){
              let passwordHash = Crypto.SHA256(password);
                if(user.passwordHash == passwordHash){
                    return res.status(200).json({
                        token:jwt.sign(user.id,'authentication',{algorithm:'HS256'}),
                        message:"login Successfull!"
                    });
                }
              }
          }
          return res.status(402).json({
            message:"Incorrect username or password!"
        });
  
    
};

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logout Success");
        res.redirect("/");
    });
};
