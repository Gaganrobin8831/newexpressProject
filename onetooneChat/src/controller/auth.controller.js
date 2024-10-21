const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const path = require('path'); // Import the path module
const { createTokenUser } = require('../services/authentication.sevice');

async function HandleRegester(req,res) {
    // console.log(req.body);
    
    const {fullName ,email,password} = req.body
    console.log({fullName ,email,password})

    try {
          // Check if a user already exists with the provided email
          const checkUser = await User.findOne({ email });
          if (checkUser) {
              // If user already exists, redirect to login with a message
              return res.render('login', { message: 'You already have an account. Please login.' });
          }
  
        const hasPasword = await bcrypt.hash(password,10) ;
        const ResgeterUser = new User({
            FullName: fullName,
            email,
            password:hasPasword
        })
        await ResgeterUser.save()
        res.redirect('/Login')
    } catch (error) {
        console.log(error);
        res.redirect('/regester')
        
    }

}


async function HandleLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render('login', { message: 'Invalid email or password' });
        }

        // Create the token
        const token = createTokenUser(user);

        // Store the token in a cookie
        res.cookie('authToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Use httpOnly for security

        // Redirect to the home page
        return res.redirect('/'); // Redirect to the root route for the home page
    } catch (error) {
        console.log(error);
        return res.status(400).redirect('/register'); // Corrected to use status()
    }
}

module.exports = {
    HandleRegester,
    HandleLogin
}