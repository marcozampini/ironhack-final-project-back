const connect = require('../index')
const { default: mongoose } = require('mongoose')


const perform = async () => {
  await connect

  await mongoose.connection.close()
}

perform()
