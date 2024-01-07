const express = require('express')
const { authController } = require('../../controllers')
const asyncHandler = require('../../utils/asyncHandler')
const validate = require('../../middlewares/validate')
const { authValidation } = require('../../validations')

const router = express.Router()

router.post('/register', validate(authValidation.register), asyncHandler(authController.register))

router.post('/login', validate(authValidation.login), asyncHandler(authController.login))
module.exports = router
