const connect = require('../index')
const { default: mongoose } = require('mongoose')

const User = require('../../models/User.model')
const Board = require('../../models/Board.model')
const List = require('../../models/List.model')

// Create list for random users for a given group
function generateFakeListForABoard(quantity, boardId, allUsersId) {
  const lists = []
  for (let i = 0; i < quantity && allUsersId.length; i++) {
    const randomIndex = Math.floor(Math.random() * allUsersId.length)
    const randomUser = allUsersId.splice(randomIndex, 1)
    let list = {
      board: boardId,
      owner: randomUser,
      status: 'pending',
    }
    lists.push(list)
  }
  return lists
}

const perform = async () => {
  try {
    await connect()

    const allUserIds = (await User.find({ name: /_fake$/ })).map(
      (user) => user._id
    )
    const allBoardIds = (await Board.find({ name: /_fake$/ })).map(
      (board) => board._id
    )

    console.log(
      `💽 Currently ${allUserIds.length} fake users and ${allBoardIds.length} fake boards in db.`
    )

    for (const boardId of allBoardIds) {
      const randomNbOfLists = 4 + Math.floor(Math.random() * 10)
      console.log(`✅ Seeding for board ${boardId} -> ${randomNbOfLists} lists`)
      const listBatch = generateFakeListForABoard(randomNbOfLists, boardId, [
        ...allUserIds,
      ])
      const listsInDb = await List.create(listBatch)
      listsInDb.map((list) =>
        console.log(
          `-> Seeded list ${list.id} for user ${list.owner} and board ${list.board}`
        )
      )
    }

    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error)
  }
}

perform()
