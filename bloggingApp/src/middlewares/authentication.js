const { validateToken } = require('../services/authentication.sevice');

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;  // Attach user payload to req for further use
    } catch (error) {
      console.log('Invalid token:', error.message);  // Log token issues
    }

    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
