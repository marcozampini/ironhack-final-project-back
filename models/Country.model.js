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
    alpha3Code: String,
    translations: {
      ces: {
        official: String,
        common: String,
      },
      deu: {
        official: String,
        common: String,
      },
      est: {
        official: String,
        common: String,
      },
      fin: {
        official: String,
        common: String,
      },
      fra: {
        official: String,
        common: String,
      },
      hrv: {
        official: String,
        common: String,
      },
      hun: {
        official: String,
        common: String,
      },
      ita: {
        official: String,
        common: String,
      },
      jpn: {
        official: String,
        common: String,
      },
      kor: {
        official: String,
        common: String,
      },
      nld: {
        official: String,
        common: String,
      },
      per: {
        official: String,
        common: String,
      },
      pol: {
        official: String,
        common: String,
      },
      por: {
        official: String,
        common: String,
      },
      rus: {
        official: String,
        common: String,
      },
      slk: {
        official: String,
        common: String,
      },
      spa: {
        official: String,
        common: String,
      },
      swe: {
        official: String,
        common: String,
      },
      urd: {
        official: String,
        common: String,
      },
      zho: {
        official: String,
        common: String,
      }
    },
    latlng: [Number],
  },
)

const Country = model('Country', countrySchema)

module.exports = Country
