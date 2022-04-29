const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const searchNames = require('../controllers/searchName.controller')
const httpStatus = require('http-status')
const NameStats = require('../models/nameModels/NameStats.model')
const Country = require('../models/Country.model')

/*
  Route to get a list of names based on research criteria:

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

router.get('/:nameId', async (req, res, next) => {
  const { nameId } = req.params
  if (!nameId) {
    return res.sendStatus(httpStatus.BAD_REQUEST)
  }
  try {
    const results = await NameStats.find({ name: nameId }).populate(
      'name country'
    )
    if (!results || !results.length) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const output = {
      id: results[0].name._id,
      value: results[0].name.value,
      countries: [],
      totalCounts: { mCount: 0, fCount: 0 },
    }

    let outputCountriesIds = []
    results.forEach((stat) => {
      if (outputCountriesIds.includes(stat.country._id)) {
        let arrayId = outputCountriesIds.indexOf(stat.country._id)

        output.countries[arrayId]._doc.stats.push({
          gender: stat.gender,
          count: stat.count,
          rank: stat.rank,
        })
      } else {
        outputCountriesIds.push(stat.country._id)

        delete stat.country._doc.name.official
        delete stat.country._doc.translations
        delete stat.country._doc.latlng

        stat.country._doc.stats = []
        stat.country._doc.stats.push({
          gender: stat.gender,
          count: stat.count,
          rank: stat.rank,
        })
        output.countries.push(stat.country)
      }
      if (stat.gender === 'f') {
        output.totalCounts.fCount += stat.count
      } else {
        output.totalCounts.mCount += stat.count
      }
    })

    return res.status(httpStatus.OK).send(output)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }
    next(error)
  }
})

/**
 * Route to get the X top names for a given country based on a CCA3 targeted
 * in the url param
 * Ex: to 20 names for Italia: /names/top/ITA/20
 * The number is optional and limited to a range of [1-1000] excluded.
 * Default is 100.
 */

router.get('/tops/:cca3', async (req, res, next) => {
  const cca3 = req.params?.cca3.toUpperCase()
  const limit = req.query?.limit || 100
  if (limit < 1 || limit > 1000) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send('Limit cannot be lower than 1 or greater than 1000')
  }

  if (!cca3 || !cca3.length) {
    return res.sendStatus(httpStatus.BAD_REQUEST)
  }
  try {
    const country = await Country.findOne({ cca3: cca3 })
    if (!country) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }
    const topBoysNames = await NameStats.find({ country: country._id })
      .sort({ mCount: -1 })
      .limit(limit)
      .populate('name')
    const topGirlsNames = await NameStats.find({ country: country._id })
      .sort({ fCount: -1 })
      .limit(limit)
      .populate('name')

    const output = {
      country,
      topBoysNames,
      topGirlsNames,
    }
    return res.status(httpStatus.OK).send(output)
  } catch (error) {
    console.log('ERROR', error)
    next(error)
  }
})

module.exports = router
