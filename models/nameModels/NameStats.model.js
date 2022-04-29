const { Schema, model } = require('mongoose')
const Name = require('./Name.model')
const Country = require('../Country.model')
/*
  NameStats are used to count the number of times a name
  was given in a specific country, for male and female
*/

const nameStatsSchema = new Schema(
  {
    name: { type: Schema.Types.ObjectId, ref: 'Name', required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    gender: {
      type: String,
      required: true,
    },
    count: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const NameStats = model('NameStats', nameStatsSchema)

module.exports = NameStats
