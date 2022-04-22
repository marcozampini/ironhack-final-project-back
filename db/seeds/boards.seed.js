const connect = require('../index')
const { faker } = require('@faker-js/faker')
const { default: mongoose } = require('mongoose')

const User = require('../../models/User.model')
const Board = require('../../models/Board.model')

function generateOneBoard(owner) {
  return {
    owner: owner._id,
    name: `${faker.word.adjective(5)}_fake`,
  }
}

// create many fake boards
async function generateFakeBoards(quantity) {
  const allUsersInDb = await User.find()
  const boards = []
  if (allUsersInDb.length) {
    for (let i = 0; i < quantity; i++) {
      const randomIndex = Math.floor(Math.random() * allUsersInDb.length)
      const board = generateOneBoard(allUsersInDb[randomIndex])
      boards.push(board)
    }
    const boardsInDb = await Board.create(boards)
    boardsInDb.forEach((board) =>
      console.log(
        `Seeded board ${board._id}, owned by user ${board.owner} under name ${board.name}.`
      )
    )
  } else {
    console.log('There are no users in the DB ! Seed some first !')
  }
}

const perform = async () => {
  try {
    await connect()
    await Board.deleteMany({ name: /_fake$/ })
    await generateFakeBoards(15)
    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error)
  }
}

perform()
