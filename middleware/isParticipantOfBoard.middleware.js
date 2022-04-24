const Board = require('../models/Board.model')
const List = require('../models/List.model')

const httpStatus = require('http-status')

/**
 * Thanks to the currentUser middleware, protects routes
 * from being accessed when the user does own a list in the board targeted
 */
async function isParticipantOfBoard(req, res, next) {
  try {
    const { boardId } = req.params
    if (!boardId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send('Missing board id parameter')
    }
    const myLists = await List.find({ owner: req.user._id })

    if (!myLists.some((l) => l.board.toString() === boardId)) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send('Not a participant in the targeted board')
    }
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  isParticipantOfBoard,
}
