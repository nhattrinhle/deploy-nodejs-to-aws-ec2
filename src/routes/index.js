const express = require('express')
const { authLimit } = require('../middlewares/rateLimit')

const router = express.Router()

// limit request
router.use('/v1/api/auth', authLimit, require('./auth'))

router.use('/v1/api', require('./test'))

module.exports = router
