const express = require('express')
const router = express.Router()
const User = require('../models/user.models')


router.get("/", async (req, res) => {
  
    const allBlogs = await User.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
});

router.route('/signin').get((req,res)=>{
    res.render('signin',{error:null})
})
.post(async(req,res)=>{
    const { email, password } = req.body;
    try {
        console.log({ email, password });  // Log email and password for debugging
        
        // Ensure email is passed as lowercase
        const token = await User.matchPasswordAndGenerateToken(email, password);

        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.log("Login error:", error.message);  // Log the error message for debugging

        return res.render("signin", {
            error: "Incorrect Email or Password"  // Display a generic error message to the user
        });
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
  });
  

router.route('/signup').get((req,res)=>{
    res.render('signup')
})
.post(async(req,res)=>{
    const {fullname,email,password} = req.body 
console.log({fullname,email,password});

    await User.create({
        fullname,
        email,
        password,
    });
    return res.redirect("/");
})


module.exports = router
