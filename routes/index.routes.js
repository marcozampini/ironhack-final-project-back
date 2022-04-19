const router = require('express').Router()
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const nameRoutes = require('./name.routes')
const boardRoutes = require('./board.routes')
const listRoutes = require('./list.routes')

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here')
})

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/names', nameRoutes)
router.use('/lists', listRoutes)
router.use('/boards', boardRoutes)

module.exports = router
