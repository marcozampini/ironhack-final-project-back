const httpStatus = require('http-status')
const Name = require('../models/nameModels/Name.model')
const NameStats = require('../models/nameModels/NameStats.model')

/*
	q: string -> the query
	mode=
		strict-query: string -> starts with 'marco' default
		soft-query: string -> has 'marco'
		initial-query: string -> 'a,b,e,i' -> starting with one of them
*/

function generateRegex(query, mode) {
  mode = mode ? mode : ''
  query = query.toUpperCase()

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

function generateQueryOptions(minLen, maxLen) {
  let searchOptions = {}
  if (minLen && maxLen) {
    searchOptions = {
      $where: `this.value.length >= ${minLen} && this.value.length <= ${maxLen}`,
    }
  } else if (minLen) {
    searchOptions = {
      $where: `this.value.length >= ${minLen}`,
    }
  } else if (maxLen) {
    searchOptions = {
      $where: `this.value.length <= ${maxLen}`,
    }
  }
  return searchOptions
}

async function searchNames(req, res) {
  const { q: query, mode, minlen: minLen, maxlen: maxLen } = req.query

  let searchOption = generateQueryOptions(minLen, maxLen)

  const searchRegex = query ? generateRegex(query, mode) : ''
  if (searchRegex) {
    searchOption.value = searchRegex
  } else if (searchRegex === null) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send(
        'invalid Mode parameter, options are strict (default), soft, initial'
      )
  }
  const namesIds = (await Name.find(searchOption)).map((n) => n._id)

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
