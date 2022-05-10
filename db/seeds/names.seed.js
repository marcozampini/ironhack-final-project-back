const connect = require('../index')
const { default: mongoose } = require('mongoose')
const namesBatchData = require('./namesBatchData.json')
const removeDiacritics = require('../../utils/removeDiacritics')

const Name = require('../../models/nameModels/Name.model')
const NameStats = require('../../models/nameModels/NameStats.model')
const Country = require('../../models/Country.model')

const seedOneStat = async (nameData, nameId, countryId) => {
  const newStat = {
    name: nameId,
    country: countryId,
    gender: nameData.gender,
    count: nameData.count,
    rank: nameData.rank,
  }
  return await NameStats.create(newStat)
}

const seedOneName = async (nameData) => {
  if (typeof nameData?.name === 'string' && !nameData.name.includes(' ')) {
    nameData.name = nameData.name.toUpperCase()
    const savedName = await Name.findOneAndUpdate(
      {
        value: nameData.name,
        valueNoDiacritics: removeDiacritics(nameData.name),
      },
      {
        value: nameData.name,
        valueNoDiacritics: removeDiacritics(nameData.name),
      },
      {
        new: true,
        upsert: true,
      }
    )

    console.log(`Seeded new NAME: ${savedName._id} -> ${savedName.value}`)

    const country = await Country.findOne({ cca3: nameData.country })
    if (country) {
      const stat = await seedOneStat(nameData, savedName._id, country._id)
      console.log(
        `Seeded ${stat._id} for ${savedName.value}, gender ${stat?.gender}, count ${stat?.count}, rank ${stat?.rank}.`
      )
    }
  } else {
    console.log(`⛔️ Not seeding ${nameData.name}, ${nameData.count}`)
  }
}

const perform = async () => {
  try {
    await connect()
    await Promise.all(namesBatchData.map((item) => seedOneName(item)))
    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error)
  }
}

perform()
