const connect = require('../index')
const { default: mongoose } = require('mongoose')
const countries = require('./countries.json')

const Country = require('../../models/Country.model')

const seedOneCountry = async (country) => {

  const savedCountry = await Country.findOneAndUpdate({ cca3: country.cca3 }, country, {
    new: true,
    upsert: true
  });
  console.log(`Seeded ${savedCountry.name.common} under ${savedCountry.cca3}.`);
}

const perform = async () => {
  try {
    await connect();
    for (let i = 0; i < countries.length; i++) {
      await seedOneCountry(countries[i]);
    }
    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error);
  }
}

perform()
