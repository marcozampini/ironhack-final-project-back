const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const searchNames = require('../controllers/searchName.controller')
const httpStatus = require('http-status')

/*
  Returns a list of names based on research criteria:

  q: string -> the query
  mode=
    strict: string -> 'marco' default
    soft: string -> 'marco'
    initial: string -> 'abei' -> starting with one of these letters

  minlen: number
  maxlen: number
*/

router.get('/', isAuthenticated, async (req, res, next) => {
  if (
    !req.query.q &&
    !req.query.mode &&
    !req.query.minLen &&
    !req.query.maxlen
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send('Missing some query parameters')
  }
  return searchNames(req, res)
})

module.exports = router
