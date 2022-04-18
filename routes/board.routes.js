const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const { isOwnerOfBoard } = require('../middleware/isOwnerOfBoard.middleware')
const { getCurrentUser } = require('../middleware/getCurrentUser.middleware')
const Board = require('../models/Board.model')
const List = require('../models/List.model')
const Link = require('../models/Link.model')
const Name = require('../models/nameModels/Name.model')
const User = require('../models/User.model')
const {
  isParticipantOfBoard,
} = require('../middleware/isParticipantOfBoard.middleware')
const httpStatus = require('http-status')

/* GET all boards for the current user */
router.get('/', isAuthenticated, getCurrentUser, async (req, res, next) => {
  const ownerId = req.user._id
  try {
    const lists = await List.find({ owner: ownerId }).populate({
      path: 'board',
      populate: { path: 'owner' },
    })
    const result = lists.map((list) => {
      return {
        _id: list.board._id,
        name: list.board.name,
        owner: list.board.owner.username,
      }
    })
    res.send(result)
  } catch (err) {
    res.json(err)
  }
})

router.get(
  '/:boardId',
  isAuthenticated,
  getCurrentUser,
  isParticipantOfBoard,
  async (req, res, next) => {
    const ownerId = req.user._id
    try {
      const { boardId } = req.params
      const board = await Board.findOne({ _id: boardId }).populate('owner')
      const lists = await List.find({ board: boardId }).populate('owner')

      const resultLists = await Promise.all(
        lists.map(async (list) => {
          const links = await Link.find({ list: list._id }).populate('name')
          const names = links.map((link) => {
            return {
              _id: link.name._id,
              value: link.name.value,
              weight: link.weight,
            }
          })
          return {
            _id: list._id,
            owner: list.owner.username,
            status: list.status,
            names: names,
          }
        })
      )

      const result = {
        _id: board._id,
        name: board.name,
        owner: board.owner.username,
        lists: resultLists,
      }
      res.send(result)
    } catch (err) {
      res.json(err)
    }
  }
)

router.post('/', isAuthenticated, getCurrentUser, async (req, res, next) => {
  const owner = req.user._id
  const { name } = req.body
  if (!name) {
    return res.status(httpStatus.BAD_REQUEST).send('Missing name property in body')
  }
  try {
    const newBoard = await Board.create({
      owner,
      name,
    })
    await List.create({
      board: newBoard._id,
      owner,
    })
    res.status(httpStatus.CREATED).send(newBoard);
  } catch (err) {
    res.json(err)
  }
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
