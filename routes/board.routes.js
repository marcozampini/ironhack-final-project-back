const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const { isOwnerOfBoard } = require('../middleware/isOwnerOfBoard.middleware')
const { getCurrentUser } = require('../middleware/getCurrentUser.middleware')
const List = require('../models/List.model')
const Board = require('../models/Board.model')
const User = require('../models/User.model')

/* GET all boards for the current user */
router.get('/', isAuthenticated, getCurrentUser, async (req, res, next) => {
  const ownerId = req.user._id
  const lists = await List.find({ owner: ownerId }).populate({
    path: 'board',
    populate: { path: 'owner' },
  })
  const result = lists.map((list) => {
    return {
      _id: list.board._id,
      board: list.board.name,
      owner: list.board.owner.username,
    }
  })
  res.send(result)
})

router.patch(
  '/:boardId',
  isAuthenticated,
  getCurrentUser,
  isOwnerOfBoard,
  async (req, res, next) => {
    try {
      const boardName = { name: req.body.name }
      const newBoardName = await Board.findByIdAndUpdate(
        req.params.boardId,
        boardName,
        {
          new: true,
        }
      )
      res.json(newBoardName)
    } catch (err) {
      res.json(err)
    }
  }
)

module.exports = router
