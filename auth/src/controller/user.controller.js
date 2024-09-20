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
        const { email, password } = req.body
        if (!(email && password)) {
            res.status(400).send('Please fill email and pssword')

        }

        const userDetail = await User.findOne({ email })
        if (!userDetail) {
            res.status(400).send('user not found')
        }
        
          // Check password
        const checkpass = bcrypt.compare(password, userDetail.password, 10)
        if (!checkpass) {
            res.status(400).send('password is wrong')
        }
         // Generate JWT token
        const token = jwt.sign({
            id: User._id,
            email: User.email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d"
            }
        )

        // Attach token to user detail (optional, if you need it)
        User.token = token;
        User.password = undefined // Remove password from the response from frontend
          // Set cookie options
        const options = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
         // Send response with token and user details
        res.status(200).cookie("token",token,options).json({
            Succes:true,
            token: token,
            userDetail
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}
module.exports = {
    HandleReg,
    HandleLogin
}