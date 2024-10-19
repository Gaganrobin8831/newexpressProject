const JWT = require('jsonwebtoken');

const secret = process.env.secret;  // Be cautious about storing secrets like this

function createTokenUser(user) {
    console.log("HEllo ",user);
    
    const payload = {
        _id: user._id,
        email: user.email,
        name:user.FullName
        
    };

    const token = JWT.sign(payload, secret, { expiresIn: "1d" });
    console.log(token);
    
    return token;
}

function validateToken(token) {
    return JWT.verify(token, secret);
}

module.exports = {
    createTokenUser,
    validateToken
};
