const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
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

module.exports = router
