const mongoose=require('mongoose')

const postSchema= new mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    authorId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    image:{
        type:String,
        required:true
    },
    likes_counts:{
        type:Number
    },
    likers:{
        type:Array,
        default:[]
    }
})

module.exports=  mongoose.model("Posts",postSchema);