const router =  require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('../models/user.js');
const passport= require("passport");


//middleware for logged in
function isLoggedIn(req,res,next){
    if(req.user){
        res.redirect("/")
    }
    else{
        next();
    }
}

//register route
router.get("/register",isLoggedIn,(req,res)=>{
    res.render("register");
})


router.get('/login',isLoggedIn,(req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    var { email, username, password, confirmpassword } = req.body;
    console.log(email, "user: ",username,"password : ",password,confirmpassword);
    var err;
    //to check for blank spaces
    if (email.trim()=="" || username.trim()=="" || password.trim()=="" || confirmpassword.trim()=="") {
        err = "Blanck Spaces are not allowed..";
        res.render('register', { err });
    }

    if (password.trim().length<6) {
        err = "Password too short...";
        res.render('register', {err,email,username});
    }
    if (password != confirmpassword) {
        err = "Passwords Don't Match";
        res.render('register', { err, email, username });
    }
    if (typeof err == 'undefined') {
       user.findOne({ email: email })
         .then(data =>{
             if (data) {
                 console.log("User Exists");
                 console.log(data);
                 err = "User Already Exists With This Email...";
                 res.render('register', {err, email, username });
                } 
            else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            password = hash;
                            //saving the new user in database
                            user({
                                email,
                                username,
                                password,
                            }).save()
                            .then(data => {
                                req.flash('success_message', "Registered Successfully.. Login To Continue..");
                                res.redirect('login');
                            })
                            .catch(err=>console.log(err));
                        });  
                    });
                }
            })
        .catch(err => console.log(err));
    }
});



router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true,
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});



module.exports = router;