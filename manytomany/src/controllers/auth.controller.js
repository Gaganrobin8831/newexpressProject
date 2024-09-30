const bycrpt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const User = require('../models/user.models');



async function HandlePost(req,res) {
    // console.log(req.query);
    // res.status(200).json({msg:"User Register Successfully"}) 
    const {name,email,password} = req.query;
    try {
        console.log(req.query);
        
        const hasPassword = await bycrpt.hash(password,10)
        console.log(hasPassword);
        //$2a$10$M.h7VApRhPnTpVCoCBdVZeTHUnaHfmBsEBTexnVJAbKkqIg0E4Eui
        const user = new User({name,email,password:hasPassword})
        await user.save(user)
        res.status(200).json({msg:"User Register Successfully"}) 
    } catch (error) {
       res.status(400).json({msg:error.message}) 
    }
}

async function HandleLogin(req,res) {
    const {email,password} = req.query;
    console.log({email,password});
    
    try {
        const user = await User.findOne({email})
       
        // console.log(await bycrpt.compare(password,user.password));
        
        if (!user){ return res.status(400).json({msg:"Invalid email"}) }
            
            
            // console.log(bycrpt);
            
        const isMatch =await bycrpt.compare(password,user.password).then((res)=>res).catch((err)=>err)
        console.log({isMatch});
        
     
        
        if (!isMatch) {return res.status(400).json({msg:"pssword"}) }
        console.log("3");
            const token = JWT.sign({_id:user._id,role:user.role},process.env.secret,{
                expiresIn:"1h"
            })
            res.cookie('token',token,{httpOnly:true})
            res.status(200).json({msg:"User Login Succesfully"}) 
     
    } catch (error) {
       res.status(400).json({msg:error.message}) 
    }
}

module.exports = {
    HandlePost,
    HandleLogin
}