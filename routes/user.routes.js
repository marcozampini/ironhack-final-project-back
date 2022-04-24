const router = require('express').Router()
const { getCurrentUser } = require('../middleware/getCurrentUser.middleware')
const { isAuthenticated } = require('../middleware/jwt.middleware')
const User = require('../models/User.model')
const authRoutes = require('./auth.routes')
const status = require('http-status')
const req = require('express/lib/request')
const escapeRegex = require('../utils/escapeRegex')

/**
 * Route to query the database for usernames, returning public infos
 *  for the found users based on lexicographic search
 */
router.get('/', isAuthenticated, async (req, res, next) => {
  const searchTerm = escapeRegex(req.query.q)
  if (searchTerm) {
    const users = await User.find({
      username: new RegExp(`${searchTerm}`, 'i'),
    })
    const result = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      }
    })
    res.status(status.OK).send(result)
  } else {
    res.sendStatus(status.BAD_REQUEST)
  }
})

module.exports = router
