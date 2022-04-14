const connect = require('../index')
const { default: mongoose } = require('mongoose')

const User = require('../../models/User.model')
const Board = require('../../models/Board.model')
const List = require('../../models/List.model')

// Create list for random users for a given group
function generateFakeListForABoard(quantity, boardId, allUsersId) {
  const list = [];
  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * allUsersId.length);
    const randomUser = allUsersId.splice(randomIndex, 1);
    let list = {
      board: boardId,
      owner: randomUser._id,
    };
    list.push(list);
  }
  return list;
}

const perform = async () => {
  try {
    await connect();

    const allUserIds = (await User.find({ name: /_fake$/ })).map(user => user._id);
    const allBoardIds = (await Board.find({ name: /_fake$/ })).map(board => board._id);

    for (let board of allBoardIds) {
      const listBatch = generateFakeListForABoard(6, allBoardIds[board], ...allUserIds);
      await List.create(listBatch);
    }

    await mongoose.connection.close()
  } catch (error) {
    console.log('Could not perform seeding : ', error);
  }
}

perform()
