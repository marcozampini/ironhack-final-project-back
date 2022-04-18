const jwt_decode = require('jwt-decode')
const Board = require('../models/Board.model')
const List = require('../models/List.model')

const status = require('http-status')
const httpStatus = require('http-status')

async function isParticipantOfBoard(req, res, next) {
  const { boardId } = req.params
  if (!boardId) {
    return res.status(httpStatus.BAD_REQUEST).send('Missing board id parameter')
  }
  const myLists = await List.find({ owner: req.user._id })

  if (!myLists.some((l) => l.board.toString() === boardId)) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send('Not a participant in the targeted board')
  }
  next()
}

module.exports = {
  isParticipantOfBoard,
}
