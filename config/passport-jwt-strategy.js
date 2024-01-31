const User = require('../models/user');
const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'authentication';
opts.algorithms=['HS256'];
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    
    try{
            let user = await User.findById(jwt_payload.id);
            if(user){
                return done(null, user);
            }
    }catch(err){

    }
    return done(null, false);
    User.findOne({_id: jwt_payload.id}, function(err, user) {
        console.log(jwt_payload);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));