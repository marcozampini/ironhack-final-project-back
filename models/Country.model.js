const { Schema, model } = require('mongoose')

/*
  Country are used as reference for names stats
*/

const countrySchema = new Schema(
  {
    name: {
      common: String,
      official: String,
    },
    cca3: String,
    translations: {
      fra: {
        official: String,
        common: String,
      },
      ita: {
        official: String,
        common: String,
      },
    },
    latlng: [Number],
  },
)

const Country = model('Country', countrySchema)

module.exports = Country
