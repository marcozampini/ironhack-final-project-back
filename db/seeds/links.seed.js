const connect = require('../index')
const { default: mongoose } = require('mongoose')

const User = require('../../models/User.model')
const Board = require('../../models/Board.model')
const List = require('../../models/List.model')
const Name = require('../../models/nameModels/Name.model')
const Link = require('../../models/Link.model')

// Create function to generate listId
// argument for the function is number of lists(quantity)
async function generateLinks(quantity) {
  const links = []
  const lists = await List.find()
  const listIds = lists.map((list) => list._id)
  const names = (await Name.find()).map((name) => name._id)

  for (let i = 0; i < quantity; i++) {
    const randomListId = listIds[Math.floor(Math.random() * listIds.length)]
    const randomNumber = Math.floor(Math.random() * 5) + 5
    for (let j = 0; j < randomNumber; j++) {
      const randomNameId = names[Math.floor(Math.random() * names.length)]
      const randomWeight = Math.floor(Math.random() * 11) - 1
      let link = {
        list: randomListId,
        name: randomNameId,
        weight: randomWeight,
      }
      links.push(link)
    }
  }
  return links
}

async function seedAllLinks(linksToSeed) {
  await Link.create(linksToSeed)
}

const perform = async () => {
  try {
    await connect()
    const linksToSeed = await generateLinks(3)
    await seedAllLinks(linksToSeed)
    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error)
  }
}

perform()
