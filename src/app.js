const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('./config/morgan')
const config = require('./config/config')
const { errorHandler } = require('./middlewares/handlerError')

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

app.use(errorHandler)

module.exports = app
