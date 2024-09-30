const mongoose = require('mongoose')
const bycrpt = require('bcryptjs')

const GroupSchema = new mongoose.Schema({
    GroupName:{
        type:String,
        lowercase:true,
        required:true
    },
    createBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{timestamps:true})




const Group = mongoose.model('Group',GroupSchema)

module.exports = Group