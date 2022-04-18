const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const searchNames = require('../controllers/searchName.controller')

/*
  Returns a list of names based on research criteria:

  q: string -> the query
  mode=
    strict: string -> 'marco' default
    soft: string -> 'marco'
    initial: string -> 'abei' -> starting with one of these letters

  minlen: number
  maxlen: number
  gender: number -> 1 boy | 2 girl, default:  any

  sort:
    alpha = default
    popularity
  order:
    asc = default
    desc
*/

router.get('/', isAuthenticated, async (req, res, next) => {
  return searchNames(req, res);
})

module.exports = router;
