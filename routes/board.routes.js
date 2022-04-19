const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const { isOwnerOfBoard } = require('../middleware/isOwnerOfBoard.middleware')
const { getCurrentUser } = require('../middleware/getCurrentUser.middleware')
const { getCurrentBoard } = require('../middleware/getCurrentBoard.middleware')
const Board = require('../models/Board.model')
const List = require('../models/List.model')
const Link = require('../models/Link.model')
const Name = require('../models/nameModels/Name.model')
const User = require('../models/User.model')
const mongoose = require('mongoose')
const {
  isParticipantOfBoard,
} = require('../middleware/isParticipantOfBoard.middleware')
const httpStatus = require('http-status')

/* GET all boards for the current user */
router.get('/', isAuthenticated, getCurrentUser, async (req, res, next) => {
  const ownerId = req.user._id
  try {
    let userIsBoardOwner
    const lists = await List.find({ owner: ownerId }).populate({
      path: 'board',
      populate: { path: 'owner' },
    })
    console.log(lists)
    const result = lists.map((list) => {
      if (list.board.owner._id.toString() === ownerId) {
        userIsBoardOwner = true
      } else {
        userIsBoardOwner = false
      }
      return {
        _id: list.board._id,
        name: list.board.name,
        owner: {
          _id: list.board.owner._id,
          username: list.board.owner.username,
          avatarUrl: list.board.owner.avatarUrl,
        },
        isOwner: userIsBoardOwner,
      }
    })
    result.sort((a, b) => {
      if (a.isOwner > b.isOwner) {
        return -1
      }
      if (a.isOwner < b.isOwner) {
        return 1
      }
      return 0
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
            owner: {
              _id: list.owner._id,
              username: list.owner.username,
              avatarUrl: list.owner.avatarUrl,
            },
            isOwner: list.owner._id.toString() === ownerId,
            names: names,
          }
        })
      )
      resultLists.sort((a, b) => {
        if (a.isOwner > b.isOwner) {
          return -1
        }
        if (a.isOwner < b.isOwner) {
          return 1
        }
        return 0
      })

      const result = {
        _id: board._id,
        name: board.name,
        owner: {
          _id: board.owner._id,
          username: board.owner.username,
          avatarUrl: board.owner.avatarUrl,
        },
        isOwner: board.owner._id.toString() === ownerId,
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
    return res
      .status(httpStatus.BAD_REQUEST)
      .send('Missing name property in body')
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
    res.status(httpStatus.CREATED).send(newBoard)
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

/**
  Add a user to a board if the user exists in the db and doesn't own another list in the board.
*/

router.post(
  '/:boardId/:userId',
  isAuthenticated,
  getCurrentUser,
  isOwnerOfBoard,
  async (req, res, next) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'UserId does not exist' })
      return
    }
    const userExist = await User.exists({ _id: userId })
    if (userExist) {
      const { boardId } = req.params
      const myLists = await List.find({ owner: userId, board: boardId })
      if (myLists.length === 0) {
        const newList = await List.create({ owner: userId, board: boardId })
        res.status(201).send('User is added to the board')
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send('User is participant in the targeted board')
      }
    }
  }
)

/**
  Deletes a full board (with list and their links) when user it is owner of it.
*/

router.delete(
  '/:boardId',
  isAuthenticated,
  getCurrentUser,
  isOwnerOfBoard,
  async (req, res, next) => {
    const board = req.targetedBoard
    try {
      console.log(board)
      const listsToDeleteIds = (await List.find({ board: board._id })).map(
        (l) => l._id
      )
      await Link.deleteMany({ list: { $in: listsToDeleteIds } })
      await List.deleteMany({ _id: { $in: listsToDeleteIds } })
      await Board.findByIdAndDelete(board._id)
      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (err) {
      return next(err)
    }
  }
)

/**
  Deletes the participant from the board if the current user is the userId
  or the board owner.
*/
router.delete(
  '/:boardId/:userId',
  isAuthenticated,
  getCurrentUser,
  getCurrentBoard,
  async (req, res, next) => {
    const board = req.targetedBoard
    const targetedUser = req.params.userId
    const currentUserId = req.user._id
    try {
      const listToDelete = await List.findOne({
        $and: [{ board: board._id }, { owner: targetedUser }],
      })
      if (!listToDelete) {
        return res.status(httpStatus.NOT_FOUND).send('Participant not found')
      }
      if (
        board.owner.toString() === currentUserId &&
        listToDelete?.owner?.toString() === currentUserId
      ) {
        return res
          .status(httpStatus.FORBIDDEN)
          .send(
            'Owner of a board cannot leave it, only delete the board all together'
          )
      }
      if (
        board.owner.toString() === currentUserId ||
        listToDelete?.owner?.toString() === currentUserId
      ) {
        await Link.deleteMany({ list: listToDelete._id })
        await List.findByIdAndDelete(listToDelete._id)
      } else {
        return res
          .status(httpStatus.FORBIDDEN)
          .send(
            'User must be board owner, or try to delete its own board participation'
          )
      }
      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (err) {
      return next(err)
    }
  }
)

module.exports = router
