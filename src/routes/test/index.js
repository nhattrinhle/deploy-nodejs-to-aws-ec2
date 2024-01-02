const express = require('express')

const router = express.Router()

router.get('/checkStatus', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'API OK'
    })
})

module.exports = router
