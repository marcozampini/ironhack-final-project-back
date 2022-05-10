const httpStatus = require('http-status')
const Name = require('../models/nameModels/Name.model')
const NameStats = require('../models/nameModels/NameStats.model')
const escapeRegex = require('../utils/escapeRegex')
const removeDiacritics = require('../utils/removeDiacritics')

/*
	q: string -> the query
	mode=
		strict-query: string -> starts with 'marco' default
		soft-query: string -> has 'marco'
		initial-query: string -> 'a,b,e,i' -> starting with one of them
*/

function generateRegex(query, mode) {
  mode = mode ? mode : ''
  query = query ? query : ''

  query = removeDiacritics(query.toUpperCase())
  query = escapeRegex(query)

  switch (mode) {
    case 'soft':
      return new RegExp(`${query}`)

    case 'initial':
      return new RegExp(`^[${query}]`)

    case 'strict':
    case '':
      return new RegExp(`^${query}`)

    default:
      return null
  }
}

/*
  Generate the length filter part of the query
*/

function generateQuery(regex, minLen, maxLen) {
  const conditions = []

  if (regex) {
    conditions.push({ valueNoDiacritics: { $regex: regex, $options: 'i' } })
  }
  if (minLen) {
    conditions.push({
      $expr: { $gte: [{ $strLenCP: '$value' }, parseInt(minLen)] },
    })
  }
  if (maxLen) {
    conditions.push({
      $expr: { $lte: [{ $strLenCP: '$value' }, parseInt(maxLen)] },
    })
  }
  console.log('SEARCH', JSON.stringify(conditions, null, 4))
  return {
    $and: conditions,
  }
}

async function searchNames(req, res) {
  const { q: query, mode, minlen: minLen, maxlen: maxLen } = req.query

  const searchRegex = generateRegex(query, mode)
  if (searchRegex === null) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(
        'invalid Mode parameter, options are strict (default), soft, initial'
      )
  }

  let searchOption = generateQuery(searchRegex, minLen, maxLen)
  if (!searchOption) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(
        'invalid Mode parameter, options are strict (default), soft, initial'
      )
  }
  const namesIds = (await Name.find(searchOption).limit(100)).map((n) => n._id)

  const results = await NameStats.aggregate([
    { $match: { name: { $in: namesIds } } },
    {
      $lookup: {
        from: 'countries',
        localField: 'country',
        foreignField: '_id',
        as: 'country',
      },
    },
    { $unwind: '$country' },
    {
      $group: {
        _id: '$name',
        countries: {
          $push: {
            _id: '$_id',
            country: '$country',
            mCount: '$mCount',
            fCount: '$fCount',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'names',
        localField: '_id',
        foreignField: '_id',
        as: 'name',
      },
    },
    { $unwind: '$name' },
  ])

  return res.status(httpStatus.OK).send(results)
}

module.exports = searchNames
