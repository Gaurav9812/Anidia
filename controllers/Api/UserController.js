const Crypto = require("crypto-js");
const { Passport, use } = require("passport");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const transporter = require("../../config/nodemailer-config");
const CryptoN = require("crypto");



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
            email,
            email_verified,
            name,
            given_name: first_name,
            family_name,
            picture,
            sup: id
        } = payload;

        let user = await User.findOne({ email: email }).exec();
        if (!user) {
            user = await User.create({
                username: email.split('@')[0],
                name: {
                    firstName: first_name,
                    lastName: family_name
                },
                profilePhoto: picture,
                socialMediaUniqueId: id,
                emailVerified: true,
                email: email,
                signUpFrom: User.GOOGLE,
                profilePhoto:picture
            });

            if (user) {
                let jwtToken = jwt.sign({ id: user.id }, "authentication", {
                    algorithm: "HS256",
                    expiresIn: 60 * 60
                });
                
                return res.status(200).json({
                    message: "User Added",
                    user: user,
                    token: jwtToken
                });
            }
        } else {
            let jwtToken = jwt.sign({ id: user.id }, "authentication", {
                algorithm: "HS256",
                expiresIn: 60 * 60
            });
            return res.status(200).json({
                token: jwtToken,
                message: "User Added",
                user: user
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports.createSessionUsingToken = async (req, res) => {
    let token = req.params.token;
    if (token) {
        try {
            let decoded = jwt.verify(token, "authentication", {
                algorithm: "HS256"
            });
            if (decoded) {
                let user = await User.findById(decoded.id).exec();
                if (user) {
                    return res.status(200).json({
                        status: 200,
                        message: "logged in",
                        user: user,
                        token: token
                    });
                }
            }
            return res.status(200).json({
                status: 201,
                message: "logged in"
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    }
};

module.exports.getUser = async function (req, res) {
    return res.status(200).json({
        message: "User created successfully"
    });
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

            const hash = CryptoN.createHmac("sha256", process.env.CRYPTO_SECRET)
                .update(username)
                .digest("hex");
            let user = await User.create({
                name: {
                    firstName: firstName,
                    lastName: lastName
                },
                email: email,
                username: username,
                dateOfBirth: dob ? dob : dobR,
                passwordHash: passwordHash,
                signUpFrom: User.MANUAL,
                randomHash: hash
            });
            if (user) {
                let redirectUri =
                    process.env.FRONTEND_URL + "/verify-email/" + hash;
                const info = await transporter.sendMail({
                    from: "gauravmehra1298gmail.com", // sender address
                    to: email, // list of receivers
                    subject: "EMAIL VERIFICATION", // Subject line
                    text: "Please click on the given link to verify you email address.", // plain text body
                    html: `<b>Please click on the given <a href='${redirectUri}'> link</a> to verify you email address.</b>` // html body
                });
                console.log(info);
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
    const { username, password } = req.body;
    
    if (username && password) {
        let user = await User.findOne()
            .or([{ username: username }, { email: username }])
            .exec();
        if (user) {
            if (user.signUpFrom == User.MANUAL) {
                // console.log(user);
                let passwordHash = Crypto.SHA256(password);
                // console.log(passwordHash);
                if (user.passwordHash == passwordHash) {
                    return res.status(200).json({
                        status: 200,
                        token: jwt.sign({ id: user.id }, "authentication", {
                            algorithm: "HS256",
                            expiresIn: 60 * 60
                        }),
                        message: "login Successfull!",
                        user: user
                    });
                }
            } else {
                return res.status(200).json({
                    status: 201,
                    message: `Loooks like you are logined from ${user.signUpFrom}!`
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

module.exports.verifyEmail = async function (req, res) {
    let hash = req.params.hash;
    try {
        let user = await User.findOne({ randomHash: hash }).exec();
        if (user) {
            if (user.emailVerified) {
                return res
                .status(200)
                .json({ message: "Your Email is already been verified!" });
            }
            if(user.signUpFrom != User.MANUAL){
                return res
                .status(200)
                .json({ message: `Looks Like your email is registered through ${user.signUpFrom}!` });
        
            }
                user.randomHash = "";
                user.emailVerified = true;
                if (user.save()) {
                    return res
                        .status(200)
                        .json({ message: "Email Verified please login!" });
                } else {
                    return res
                        .status(200)
                        .json({ message: user.errors.toString() });
                }
            }
        return res
            .status(200)
            .json({ message: "Not found please try again later!" });
    } catch (err) {
        return res.status(200).json({ message: err.message });
    }
};

module.exports.forgotPassword = async function(req,res){
        const {email} = req.body;
        try{
                let user = await User.findOne({email:email}).exec();
                if(user){
                    if(user.signUpFrom != User.MANUAL){
                        return res
                        .status(200)
                        .json({ message: `Looks Like your email is registered through ${user.signUpFrom}!` });
                
                    }

                    const token = await user.generateResetToken();
                    
                    user = await user.save();
                    if(!(user)){
                        return res
                        .status(200)
                        .json({ message: `unable to store data `});
                
                    }
                    const redirectUri = process.env.FRONTEND_URL + "/reset-password/" + token;

                    const info = await transporter.sendMail({
                        from: "gauravmehra1298gmail.com", // sender address
                        to: email, // list of receivers
                        subject: "Reset Password", // Subject line
                        text: "Please click on the given link to verify you email address.", // plain text body
                        html: `<b>Please click on the given <a href='${redirectUri}'> link</a> to verify reset your password.</b>` // html body
                    });

                    return res
                    .status(200)
                    .json({ status:200,message: 'Password reset mail is send to your provided email!' });
                
                }else{
                    return res
                    .status(200)
                    .json({ status:201,message: 'No user is registerd with this email!' });
                
                }
        }catch(err){
            console.log(err);
        return res.status(200).json({status:500 ,message: err.message });
        }



}


module.exports.resetPassword = async function(req,res){
    const token = req.params.hash;
    const {password,confirmPassword} = req.body;
    try{

        const hash =  CryptoN.createHmac(User.SHA256,process.env.CRYPTO_SECRET).update(token).digest('hex');
        
            let user = await User.findOne({resetToken:hash});
        
        
            if(user){
                
                if(user.resetTokenExpiresAt < Date.now()){
                    return res
                    .status(200)
                    .json({ status:201,message: 'Token has expired please try again!' });
                }
                if(password != confirmPassword){
                    return res
                    .status(200)
                    .json({ status:201,message: 'Password and confirm password must be same!' });
                }
                let passwordHash = Crypto.SHA256(password);
                user = await user.update({
                    password:passwordHash,
                    resetToken:null,
                    resetTokenExpiresAt:null
                }).exec();
                if(user){
                    return res
                    .status(200)
                    .json({ status:200,message: 'Password reseted successfully!' });
                }
                
            }
                return res
                .status(200)
                .json({ status:201,message: 'Invalid Hash'});
            
            
    }catch(err){
        console.log(err);
    return res.status(200).json({status:500 ,message: err.message });
    }
}