const JWT = require('jsonwebtoken');

const secret = "superMan@1234";  // Be cautious about storing secrets like this

function createTokenUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImgUrl,  // Ensure consistent key names
        role: user.role
    };

    const token = JWT.sign(payload, secret, { expiresIn: "1h" });
    return token;
}

function validateToken(token) {
    return JWT.verify(token, secret);
}

module.exports = {
    createTokenUser,
    validateToken
};
