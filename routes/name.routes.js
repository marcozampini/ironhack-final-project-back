const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const searchNames = require('../controllers/searchName.controller')
const httpStatus = require('http-status')
const NameStats = require('../models/nameModels/NameStats.model')

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

router.get('/:nameId', isAuthenticated, async (req, res, next) => {
  const { nameId } = req.params
  try {
    const results = await NameStats.find({ name: nameId }).populate(
      'name country'
    )
    if (!results.length) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const output = {
      id: results[0].name._id,
      value: results[0].name.value,
      countries: [],
    }
    results.forEach((stat) => {
      stat.country._doc.mCount = stat.mCount;
      stat.country._doc.fCount = stat.fCount;
      console.log('STATS COUNTRY', stat.country);
      output.countries.push(stat.country)
    })
    console.log(results);

    output.totalCounts = results.reduce((prev, current) => {
      prev.mCount += current?.mCount || 0;
      prev.fCount += current?.fCount || 0;
      return prev;
    }, { mCount: 0, fCount: 0})

    console.log(output)
    return res.status(httpStatus.OK).send(output)
  } catch (error) {
    console.log('ERROR', error)
    next(error)
  }
})

module.exports = router
