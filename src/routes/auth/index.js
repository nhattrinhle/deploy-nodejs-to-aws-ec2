const express = require('express')
const { SuccessResponse } = require('../../core/success.response')

const router = express.Router()

router.get('/', (_req, res, _next) => {
    new SuccessResponse({
        message: 'OK',
        metaData: {
            name: 'Le Nhat Trinh'
        }
    }).send(res)
})

module.exports = router
