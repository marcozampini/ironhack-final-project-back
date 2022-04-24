const jwt_decode = require("jwt-decode");

/**
 *  Extracts the currentUser in the given JWT, and store
 * the data contained in the request object for later access
 */
function getCurrentUser(req, res, next) {
  if (req.token) {
    req.user = jwt_decode(req.token);
    next();
  } else {
    next(new Error('missing user token'));
  }
}

module.exports = {
  getCurrentUser,
}
