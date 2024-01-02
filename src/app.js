const express = require('express')
const morgan = require('morgan')

const app = express()

// init middlewares
app.use(morgan('dev'))

// router
app.use(require('./routes'))

app.use((_req, _res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, _req, res) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error!'
    })
})

module.exports = app
