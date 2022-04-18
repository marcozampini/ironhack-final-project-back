const { isOwnerOfList } = require('../middleware/isOwnerOfList.middleware')
const { isAuthenticated } = require('../middleware/jwt.middleware')
const { getCurrentUser } = require('../middleware/getCurrentUser.middleware')
const Link = require('../models/Link.model')
const List = require('../models/List.model')
const router = require('express').Router()

router.post(
  '/:listId',
  isAuthenticated,
  getCurrentUser,
  isOwnerOfList,
  async (req, res, next) => {
    try {
      const listId = req.params.listId
      const nameId = req.body.name
      const nameExist = await Link.find({ name: nameId, list: listId })
      console.log(nameExist)

      if (nameExist.length === 0) {
        const linkToCreate = req.body
        linkToCreate.list = listId
        const newLink = await Link.create(linkToCreate)
        res.json(newLink)
      } else {
        res.json('Name already exist in the  list')
      }
    } catch (error) {
      next(error)
    }
  }
)

router.delete(
  '/:listId/:linkId',
  isAuthenticated,
  getCurrentUser,
  isOwnerOfList,
  async (req, res, next) => {
    try {
      const { linkId } = req.params
      await Link.findByIdAndRemove(linkId)
      res.status(204).json({ message: 'Link deleted' })
    } catch (err) {
      res.json(err)
    }
  }
)

module.exports = router
