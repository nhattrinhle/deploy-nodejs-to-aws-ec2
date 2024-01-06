const express = require('express')
const cors = require('cors')
// const morgan = require('morgan')
const helmet = require('helmet')
const morgan = require('./config/morgan')
const config = require('./config/config')

const app = express()

// init middlewares
if (config.env !== 'test') {
    app.use(morgan.successHandler)
    app.use(morgan.errorHandler)
}

// set security http headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// enable cors
app.use(cors())
app.options('*', cors())

// init db
require('./dbs/mongodb.init')

// router
app.use(require('./routes'))

app.use((_req, _res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, _req, res, _next) => {
    const statusCode = error.status || 500
    const response = {
        error: {
            status: statusCode,
            message: error.message || 'Internal Server Error'
        }
    }
    return res.status(statusCode).send(response)
})

module.exports = app
