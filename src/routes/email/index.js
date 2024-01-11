const express = require('express')
const { emailController } = require('../../controllers')
const asyncHandler = require('../../utils/asyncHandler')
const validate = require('../../middlewares/validate')
const { emailValidation } = require('../../validations')

const router = express.Router()

// router.post('/send-verification-email', asyncHandler(emailController.sendVerificationEmail))

router.get(
    '/verify-email/:userId/:token',
    validate(emailValidation.verifyEmail),
    asyncHandler(emailController.verifyEmail)
)

module.exports = router
