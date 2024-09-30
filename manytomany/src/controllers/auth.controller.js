const bycrpt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const User = require('../models/user.models');



async function HandlePost(req,res) {
    // console.log(req.query);
    // res.status(200).json({msg:"User Register Successfully"}) 
    const {name,email,password} = req.query;
    try {
        console.log(req.query);

        // Generate the salt manually
        const salt = await bycrpt.genSalt(10);
        console.log("Generated Salt: ", salt);

        // Hash the password using the manually generated salt
        const hashedPassword = await bycrpt.hash(password, salt);
        console.log("Hashed Password: ", hashedPassword);

        // Create a new user with the hashed password
        const user = new User({ name, email, password: hashedPassword });
        await user.save();  // No need to pass user into .save()

        res.status(200).json({ msg: "User Registered Successfully" });
    } catch (error) {
       res.status(400).json({msg:error.message}) 
    }
}



async function HandleLogin(req, res) {
    const { email, password } = req.query;

    // Sanitize input values (removes leading/trailing spaces)
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();

    console.log("Sanitized Email: ", sanitizedEmail);
    console.log("Raw Password (before hashing): ", sanitizedPassword);

    try {
        // Find user by email
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        }

        // Log the stored hashed password
        console.log("Stored Hashed Password in DB: ", user.password);

        // Compare the provided password with the stored hashed password
        const isMatch = await bycrpt.compare(sanitizedPassword, user.password);
        console.log("Password Match Result: ", isMatch);  // Log the comparison result

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        // Generate token on successful login
        const token = JWT.sign(
            { _id: user._id, role: user.role },
            process.env.secret,
            { expiresIn: "1h" }
        );

        // Set token as HTTP-only cookie
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ msg: "User Logged in Successfully" });

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

async function HandleLogout(req,res) {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}
module.exports = {
    HandlePost,
    HandleLogin,
    HandleLogout
}

