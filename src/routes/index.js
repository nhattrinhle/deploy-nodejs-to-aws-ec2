const express = require('express')
const { authLimit } = require('../middlewares/rateLimit')

const router = express.Router()

router.use('/v1/api/email', require('./email'))

// limit request
router.use('/v1/api/auth', authLimit, require('./auth'))

router.use('/v1/api', require('./test'))

module.exports = router
