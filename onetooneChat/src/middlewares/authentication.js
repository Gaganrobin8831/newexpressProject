const { validateToken } = require('../services/authentication.sevice');

function checkAuth(req, res, next) {
  const token = req.cookies.authToken; // Access the cookie
  if (!token) {
      return res.redirect('/Login'); // Redirect to login if token doesn't exist
  }

  try {
      const userPayload = validateToken(token); // Validate the token
      req.user = userPayload; // Attach user payload to request for further use
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      console.log('Invalid token:', error.message);
      return res.redirect('/Login'); // Redirect to login if the token is invalid
  }
}


module.exports = {
  checkAuth,
};
