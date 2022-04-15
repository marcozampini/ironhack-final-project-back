const jwt_decode = require("jwt-decode");

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
