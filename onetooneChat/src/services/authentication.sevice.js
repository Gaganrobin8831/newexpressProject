const JWT = require('jsonwebtoken');

const secret = "superMan@1234";  // Be cautious about storing secrets like this

function createTokenUser(user) {
    console.log("HEllo ",user);
    
    const payload = {
        _id: user._id,
        email: user.email,
        name:user.FullName
        
    };

    const token = JWT.sign(payload, "thdgfiawyutryty3r634gt", { expiresIn: "1d" });
    console.log(token);
    
    return token;
}

function validateToken(token) {
    return JWT.verify(token, "thdgfiawyutryty3r634gt");
}

module.exports = {
    createTokenUser,
    validateToken
};
