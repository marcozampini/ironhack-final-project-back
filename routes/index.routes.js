const router = require('express').Router()
const authRoutes = require('./auth.routes')
const boardRoutes = require('./board.routes')

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here')
})

router.use('/auth', authRoutes)
router.use('/boards', boardRoutes)

module.exports = router
