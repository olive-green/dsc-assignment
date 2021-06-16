const express=require("express")
const app=express()
const mongoose=require('mongoose')
const passport=require("passport");
const session = require('express-session');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const Posts=require("./models/posts");
const User=require("./models/user");
const methodOverride=require("method-override")
require("dotenv").config();
const authRoutes=require("./routes/auth-routes");
const postRoutes=require("./routes/post-routes");
require("./middlewares/passport-setup");



const port= process.env.PORT || 3000

// database connectivity
mongoose.connect(process.env.dbURL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log(err))



app.set("view engine","ejs");
app.use(express.static("public"))
// using Bodyparser for getting form data
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



// using cookie-parser and session 
app.use(cookieParser('secret'));
app.use(session({
    secret: 'Pankaj',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));
// using passport for authentications 
app.use(passport.initialize());
app.use(passport.session());
// using flash for flash messages 
app.use(flash());

// MIDDLEWARES
// Global variable
app.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

//middleware for checking authenticated user
const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}




// Home Route
app.get("/",checkAuthenticated,async (req,res)=>{

    const user=await User.find({"_id":req.user.id});
    
    //here we are getting the loggedin user's following list
    let following=user[0].following || [];
    following.push(req.user.id);
    //here we fetching  posts of those users which are followed by logged in user 
    const posts=await Posts.find({"authorId":{$in:following}});
    
    // Here we are checking on which post loggedin user had liked.
    for(let i=0;i<posts.length;i++){
        let likedusers=posts[i].likers;
        let like=false;
        if(likedusers.find((user)=>user==req.user.id)){
            like=true;
        }
        posts[i].like=like;
    }
    
    
    //here we are fetching all those users who are not followed by loggedin user
    const users=await User.find({"_id":{$nin:following}});
    

    let cssFile="index.css";
    let pageTitle="Home | Twitter";
    res.render("index",{user : req.user,cssFile,pageTitle,posts,users});
})

//route for following user
app.post('/follow/:id',(req,res)=>{
     
    User.updateOne({
        "_id":req.user.id
  } 
  ,
  {
   $push:{
           following:req.params.id
       }
},(err,data)=>{
   console.log("followed");
})


});




//routes
app.use(authRoutes);
app.use("/post",postRoutes);

app.listen(port,()=>{
    console.log(`Server is listening on ${port}`)
})
