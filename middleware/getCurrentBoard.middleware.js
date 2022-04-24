const Board = require('../models/Board.model')
const status = require('http-status')

/**
 *  Extracts the bordId in the url param, finds it in the DB and store
 * the entity found in the request object for later access
 */
async function getCurrentBoard(req, res, next) {
  try {
    const board = await Board.findById(req.params.boardId)
    if (!board) {
      return res.status(status.NOT_FOUND).send(`Board doesn't exist!!`)
    }
    req.targetedBoard = board
    next();
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getCurrentBoard,
}
