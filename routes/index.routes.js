const router = require('express').Router()
const authRoutes = require('./auth.routes')
const boardRoutes = require('./board.routes')
const usersRoutes = require('./user.routes')
const listRoutes = require('./list.routes')

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here')
})

router.use('/auth', authRoutes)
router.use('/lists', listRoutes)
router.use('/boards', boardRoutes)
router.use('/users', usersRoutes);

module.exports = router
