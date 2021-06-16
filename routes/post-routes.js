const router =  require('express').Router();
const mongoose = require('mongoose');
const user = require('../models/user.js');
const Post = require('../models/posts.js');

router.get("/newPost",(req,res)=>{
    let cssFile="newPost.css";
    let pageTitle="Home | NewPost";
    res.render("posts/newPost",{cssFile,pageTitle});
})



router.post('/save',async (req,res,next)=>{
    req.post= new Post();
    next();
},saveArticleAndRedirect("newPost"))

router.put('/:id',async (req,res,next)=>{
    req.post= await Post.findById(req.params.id);
    next()
},saveArticleAndRedirect('edit'))


function saveArticleAndRedirect(path){
    return async (req,res)=>{
        let post= req.post
            post.author=req.user.username
            post.email=req.user.email
            post.profileImg=req.user.profileImg
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


router.get('/:id', async (req, res) => {
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

router.get('/edit/:id', async (req,res)=>{
    // res.send(req.params.id);
    let post= await Post.findById(req.params.id);
   res.render('posts/edit',{post,user:req.user});  
})


router.delete('/:id',async (req,res)=>{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports=router;