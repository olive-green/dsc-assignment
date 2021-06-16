const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    following:{
        type: Array,
        default:[]
    }
});

module.exports = mongoose.model('user', userSchema);