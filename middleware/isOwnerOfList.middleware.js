const jwt_decode = require('jwt-decode')
const List = require('../models/List.model')
const status = require('http-status')

/**
 * Thanks to the currentUser middleware, protects routes
 * from being accessed when the user does not own the targeted List.
 */
async function isOwnerOfList(req, res, next) {
  try {
    const list = await List.findById(req.params.listId)
    if (!list) {
      return res.status(status.NOT_FOUND).send(`List doesn't exist!!`)
    }
    const user = req.user
    if (list.owner.toString() === user._id) {
      next()
    } else {
      return res
        .status(status.FORBIDDEN)
        .send(`List doesn't belong to this user!!`)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  isOwnerOfList,
}
