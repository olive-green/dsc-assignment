const passport= require("passport");

const user=require("../models/user");
const bcrypt=require("bcrypt")


// // Authentication Strategy
// ---------------
var localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    user.findOne({ email: email })
    .then((data) => {
        if (!data) {
            return done(null, false, { message: "User Doesn't Exists.." });
        }
        bcrypt.compare(password, data.password, (err, match) => {
            if (err) {
                return done(null, false);
            }
            if (!match) {
                return done(null, false, { message: "Password Doesn't Match" });
            }
            if (match) {
                return done(null, data);
            }
        });
    });
}));


passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    user.findById(id, function (err, user) {
        cb(err, user);
    });
});
// ---------------
// end of autentication statregy
