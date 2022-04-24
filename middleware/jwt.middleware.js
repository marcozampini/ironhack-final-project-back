const jwt = require('express-jwt')

/**
 * Extracts the JWT from the headed and check for validity to protect access
 * to routes for which user has to be authenticated
 */

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
})

function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Get the encoded token string and return it
    req.token = req.headers.authorization.split(' ')[1]
    return req.token
  }

  return null
}

module.exports = {
  isAuthenticated,
}
