const router =  require('express').Router();
const mongoose = require('mongoose');
const user = require('../models/user.js');
const Post = require('../models/posts.js');


//middleware for checking authenticated user
const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}


router.get("/newPost",checkAuthenticated,(req,res)=>{
    let cssFile="newPost.css";
    let pageTitle="Home | NewPost";
    res.render("posts/newPost",{cssFile,pageTitle,user:req.user});
})



router.post('/save',checkAuthenticated,async (req,res,next)=>{
    req.post= new Post();
    next();
},savePostAndRedirect("newPost"))

router.put('/:id',checkAuthenticated,async (req,res,next)=>{
    req.post= await Post.findById(req.params.id);
    next()
},savePostAndRedirect('edit'))


function savePostAndRedirect(path){
    return async (req,res)=>{
        let post= req.post
            post.author=req.user.username
            post.authorId=req.user.id
            post.email=req.user.email
            // post.profileImg=req.user.profileImg
            post.title=req.body.title
            post.description=req.body.description
            post.image=req.body.image
        
        try{
            post= await post.save()
            res.redirect(`/post/${post.id}`)
        }
        catch(err){
            console.log(err)
            res.render(`posts/${path}`,{post:post})
        }   
    }
}


router.get('/:id',checkAuthenticated, async (req, res) => {
    let cssFile = "";
    let pageTitle = req.user.username + "| Posts";
    // res.send(req.params.id);
    let post= await Post.findById(req.params.id);
        if(post == null)
        {
            res.redirect('/');
    }
    // console.log(article);
      res.render('posts/show',{post,pageTitle,cssFile,user:req.user});  
})

router.get('/edit/:id',checkAuthenticated, async (req,res)=>{
    // res.send(req.params.id);
    let post= await Post.findById(req.params.id);
   res.render('posts/edit',{post,user:req.user});  
})


router.delete('/:id',checkAuthenticated,async (req,res)=>{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.post("/:id/likeCounts",checkAuthenticated,async (req,res)=>{
    
    let post=await Post.findById(req.params.id);
    let likedusers=post.likers;
    

    //check if user already liked the post
    if(likedusers.find((user)=>user==req.user.id)){
        console.log("you have already liked");
        return;
    }



    Post.updateOne({
                    "_id":req.params.id
            } 
            ,
            {
                $push:{
                        likers:req.user.id
                    }
            },(err,data)=>{
                console.log(data);
            })

        
});

module.exports=router;