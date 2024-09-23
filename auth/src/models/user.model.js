const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String
    },
    otp:{
        type:String,
        default:''
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

module.exports = User