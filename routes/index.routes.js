const router = require('express').Router()
const authRoutes = require('./auth.routes')
const listRoutes = require('./list.routes')

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here')
})

router.use('/auth', authRoutes)
router.use('/lists', listRoutes)

module.exports = router
