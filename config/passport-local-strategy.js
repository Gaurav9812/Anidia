const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const Crypto = require("crypto-js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      let user = await User.findOne({ email: email });
      //     if (err) {
      //       return done(err);
      //     }
      //     password = Crypto.SHA256(password);

      //     if (!user && user.passwordHash != password) {
      //       return done(null, false);
      //     }
      //     return done(null, user);
      //   });
      if (user) {
        password = Crypto.SHA256(password);
        if (user.passwordHash == password) {
          return done(null, user);
        }
        console.log("Incorrect username and password");
        return done(null, false);
      }
      console.log("User not found");
      return done(err);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let user = await User.findById(id);
  if (user) {
    return done(null, user);
  }
  console.log("error while finding user");
  return done(user);
});

passport.checkAuthentication = function (req, res, next) {
  console.log("hello");
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/user/login");
};

passport.setAuthenticatedUser = function (req, res, next) {
  console.log("Authenticated user " + req.user);
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  return next();
  // return res.redirect("/login");
};

module.exports = passport;
