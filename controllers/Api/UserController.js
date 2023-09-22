const Crypto = require("crypto-js");
const { Passport } = require("passport");
const User = require("../models/user");
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
        email,
        password,
        confirmPassword,
        username
    } = req.body;
    console.log(req.body);
    return;
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
                dateOfBirth: dob,
                passwordHash: passwordHash
            });
            if (user) {
                return res.json(200, {
                    message: "User created successfully"
                });
            }
        } catch (err) {
            return res.json(500, { message: err });
        }
    }
    return res.json(500, {
        message: "Password and confirm password are not same"
    });
};

module.exports.createSession = function (req, res) {
    req.flash("info", "Logged in successfully");

    return res.redirect("/");
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
