const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const randomString = require('randomstring')


async function hashPassword(password) {
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
}

const sendResetPasswordMail = async (name,email,otp)=> {
    try {
//         console.log('Email:', process.env.MY_EMAIL);
// console.log('Password:', process.env.MY_PASSWORD);
// console.log({email});


        const tranportMail = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD
            }
        });

        const mailOption = {
            from:process.env.MY_EMAIL,
            to: email,
            subject: 'Reset Password',
            html : `<h1> Hi ${name} </h1>
            <p> click on the link <a href="http://localhost:4000/reset-pasword?otp=${otp}">reset Password</a></p>`,
        }

     await tranportMail.sendMail(mailOption,function(error,info){
            if(error){
               console.log(error);  
            }
            else{
                console.log('Email sent: ' + info.response);
            }
        })
        
    } catch (error) {
        res.status(400).send({success:false,message:error})
    }
}


async function forgetPassword(req,res) {
    try {

        const data = await User.findOne({email:req.body.email})
        if(!data){
            return res.status(400).send({success:false,message:'Email not found'})
       }
       const otp = randomString.generate();

       await User.updateOne({email:req.body.email},
        {$set:{otp:otp}}
       )

       sendResetPasswordMail(data.name,data.email,otp)
       
       return res.status(200).send({success:true,message:'Please Check your Email'})

    } catch (error) {
        res.status(400).send({success:false,message:error})
    }
}


async function resetPass(req,res) {
    try {
        const otp = req.query.otp;
        const newpassword = req.body.New_password

        // Validate the OTP and handle the password reset logic
        if (otp) {
            const data = await User.findOne({otp:otp})
            console.log(newpassword);

            const ENCRYPTPASWORD = await hashPassword(newpassword)
            console.log(ENCRYPTPASWORD);

          const neData =  await User.findByIdAndUpdate({_id:data._id },{
                $set:{
                    password:ENCRYPTPASWORD,
                    
                },
                $unset:{otp:1}
        },{
            new: true
          })
            
            // Logic for password reset (e.g., show a reset form)
            res.send(neData);
        } else {
            res.status(400).send('Invalid OTP');
        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error})
    }
}
module.exports ={ forgetPassword ,resetPass}