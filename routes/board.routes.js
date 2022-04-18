const router = require('express').Router()
const { isAuthenticated } = require('../middleware/jwt.middleware')
const { getCurrentUser } = require('../middleware/getCurrentUser.middleware')
const Board = require('../models/Board.model')
const List = require('../models/List.model')
const Link = require('../models/Link.model')
const Name = require('../models/nameModels/Name.model')
const User = require('../models/User.model')

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
  async (req, res, next) => {
    const ownerId = req.user._id
    try {
      const { boardId } = req.params
      const board = await Board.findOne({ _id: boardId }).populate('owner')
      const lists = await List.find({ board: boardId }).populate('owner')

      const resultLists = lists.map((list) => {
        // const links = await Link.find({ list: list._id }).populate('name')
        // console.log(links)
        // const names = links.map((link) => {
        //   return {
        //     _id: link.name._id,
        //     value: link.name.value,
        //   }
        // })
        return {
          _id: list._id,
          owner: list.owner.username,
          status: list.status,
          names: [
            {
              _id: 'ofhsdoifdssdfsfsdfsoif',
              value: 'NAME1',
            },
            {
              _id: 'dsfdfsosdffhsdoifdsoif',
              value: 'NAME2',
            },
          ],
        }
      })
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

module.exports = router
