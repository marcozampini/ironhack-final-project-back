const jwt_decode = require('jwt-decode')
const Board = require('../models/Board.model')
const status = require('http-status')

/**
 * Thanks to the currentUser and getCurrentBoard middlewares, protects routes
 * from being accessed when the user does not own the board.
 */
async function isOwnerOfBoard(req, res, next) {
  try {
    const board = await Board.findById(req.params.boardId)
    if (!board) {
      return res.status(status.NOT_FOUND).send(`Board doesn't exist!!`)
    }
    req.targetedBoard = board
    const user = req.user
    if (board.owner.toString() === user._id) {
      next()
    } else {
      return res
        .status(status.FORBIDDEN)
        .send(`Board doesn't belong to the user!!`)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  isOwnerOfBoard,
}
