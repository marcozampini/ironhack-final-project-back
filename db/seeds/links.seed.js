const connect = require('../index')
const { default: mongoose } = require('mongoose')

const User = require('../../models/User.model')
const Board = require('../../models/Board.model')
const List = require('../../models/List.model')
const Name = require('../../models/nameModels/Name.model')
const Link = require('../../models/Link.model')

// generate some Links for a given ListId
function generateLinksForOneList(quantity, listId, names) {
  const links = [];
  for (let j = 0; j < quantity; j++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomWeight = Math.floor(Math.random() * 11) - 1
    let link = {
      list: listId,
      name: randomName._id,
      weight: randomWeight,
    }
    console.log(`Seeding list ${listId} with ${randomName.value} of weight ${randomWeight}`);
    links.push(link)
  }
  return links;
}

// Iterates on every existing Lists in the db and generate some Links for it.
async function generateLinks() {
  let links = []
  const lists = await List.find()
  const listIds = lists.map((list) => list._id)
  const names = await Name.find();

  for (let i = 0; i < listIds.length; i++) {
    const randomQuantity = Math.floor(Math.random() * 5) + 5
    console.log(`✅ Seeding ${randomQuantity} links for the list ${listIds[i]}`);
    const currentListLinks = generateLinksForOneList(randomQuantity, listIds[i], names)
    links = [...links, ...currentListLinks];
  }
  return links
}

async function seedAllLinks(linksToSeed) {
  await Link.create(linksToSeed)
}

const perform = async () => {
  try {
    await connect()
    const linksToSeed = await generateLinks()
    await seedAllLinks(linksToSeed)
    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error)
  }
}

perform()
