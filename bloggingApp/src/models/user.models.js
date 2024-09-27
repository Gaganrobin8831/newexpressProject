const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenUser } = require('../services/authentication.sevice');

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    profileImgUrl: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

// Password Hashing Middleware for Registration
userSchema.pre('save', function (next) {
    const user = this;

    // If password is not modified, skip this middleware
    if (!user.isModified('password')) return next();

    // Generate a random salt
    const salt = randomBytes(16).toString('hex');

    // Hash the password with the generated salt
    const hashPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    // Set the salt and hashed password on the user object
    user.salt = salt;
    user.password = hashPassword;

    next();
});

// Method to match the provided password and generate token
userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email: email.toLowerCase() });  // Ensure email is case-insensitive
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    // Hash the provided password with the stored salt
    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    // Compare hashed passwords
    if (hashedPassword !== userProvidedHash) {
        console.log("Passwords don't match!"); // Log for debugging
        throw new Error("Incorrect Password");
    }

    // Generate token after successful authentication
    const token = createTokenUser(user);
    return token;
});

const User = model('User', userSchema);
module.exports = User;
