const jwt_decode = require('jwt-decode')
const Board = require('../models/Board.model')
const status = require('http-status')

async function isOwnerOfBoard(req, res, next) {
  const board = await Board.findById(req.params.boardId)
  if (!board) {
    return res.status(status.NOT_FOUND).send(`Board doesn't exist!!`)
  }
  const user = req.user
  if (board.owner.toString() === user._id) {
    next()
  } else {
    return res
      .status(status.FORBIDDEN)
      .send(`Board doesn't belong to the user!!`)
  }
}

module.exports = {
  isOwnerOfBoard,
}
