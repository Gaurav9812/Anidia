const Crypto = require("crypto-js");
const { Passport, use } = require("passport");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");


module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("signup");
};
async function verify(token) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token?.credential,
        audience: token?.clientId // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    return payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

module.exports.logIn = async function (req, res) {
    const token = req.body;
    try {
        const payload = await verify(token);
       
        const {
            email,email_verified ,name,given_name:first_name,family_name,picture,sup : id

       } = payload;

       let user =  await User.findOne({email:email}).exec();
       if(!user){
        user = await User.create({
        username:email,
        name: {
            firstName:first_name,
            lastName:family_name,
        },
        avtar:picture,
        socialMediaUniqueId:id,
        emailVerified:true,
        email:email,
        signUpFrom:User.GOOGLE
        
       });

       if(user){
        let jwtToken =await jwt.sign(user.id, "authentication", {
            algorithm: "HS256",
            expiresIn:60*60
        });
        console.error(user);
            return res.status(200).json({
                message:"User Added",
                user:user    ,
                token: jwtToken
            });
       }
    }else{
        let jwtToken = jwt.sign(user.id, "authentication", {
            algorithm: "HS256",
            expiresIn:60*60
            
        });
        return res.status(200).json({
            token: jwtToken,    
            message:"User Added",
            user:user,
        });
    }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message:err.message, 

        });
    }
};

module.exports.createSessionUsingToken=async (req,res)=>{
    let token = req.params.token;
    if(token){
        let decoded = jwt.verify(token,"authentication");
        try {
            let user = await User.findById(decoded).exec();
            if(user){
            return res.status(200).json({
                status:200,
                message:"logged in",
                user:user,
                token:token,
            });  
         }else{
            return res.status(200).json({
                status:201,
                message:"logged in",
                user:user,
                token:token,
            }); 
         }
        }catch(err){
            return res.status(500).json({
                message:err.message
            });     
        }
    }
}

module.exports.getUser = async function (req, res) {};

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
                passwordHash: passwordHash,
                signUpFrom:User.MANUAL
            });
            if (user) {
                return res.status(200).json({
                    message: "User created successfully",
                    
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
    const { username, password } = req.body;
    console.log(username, password);
    if (username && password) {
        let user = await User.findOne({ username: username });
        if (user) {
            console.log(user);
            let passwordHash = Crypto.SHA256(password);
            if (user.passwordHash == passwordHash) {
                return res.status(200).json({
                    token: jwt.sign(user.id, "authentication", {
                        algorithm: "HS256",
                        expiresIn:60*60
                    }),
                    message: "login Successfull!",
                    user: user
                });
            }
        }
    }
    return res.status(402).json({
        message: "Incorrect username or password!"
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
