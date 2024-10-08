const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



async function HandleReg(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!(name && email && password)) {
            return res.status(400).send("Name, email, and password are required.");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists.");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // Attach token and remove password before sending response
        newUser.token = token;
        newUser.password = undefined;

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}



async function HandleLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send('Please fill email and password');
        }

        const userDetail = await User.findOne({ email });
        if (!userDetail) {
            return res.status(400).send('User not found');
        }

        // Check password using await
        const isMatch = await bcrypt.compare(password, userDetail.password);
        if (!isMatch) {
            return res.status(400).send('Password is wrong');
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: userDetail._id,
                email: userDetail.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d"
            }
        );

        // Remove password from user detail
        userDetail.password = undefined;

        // Set cookie options
        const options = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // Send response with token and user details
        res.status(200).cookie("token", token, options).json({
            Success: true,
            message: "YOU ARE SUCCESFULLY LOGIN",
            token: token,
            userDetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    HandleReg,
    HandleLogin
}