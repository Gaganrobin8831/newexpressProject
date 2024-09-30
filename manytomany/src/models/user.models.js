const mongoose = require('mongoose')
const bycrpt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
      
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        lowercase:true,
        required:true
    },
    role:{
        type:String,
        default:'user'
    },
    Groups:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Groups'
    }
},{timestamps:true})



// UserSchema.pre('save',async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     this.password = await bycrpt.hash(this.password,10);
//     next()
// })

const User = mongoose.model('User',UserSchema)

module.exports = User