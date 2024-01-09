const config = require('../config/config')

const errorHandler = (error, _req, res, _next) => {
    const statusCode = error.status || 500
    res.locals.errorMessage = error.message
    const response = {
        error: {
            status: statusCode,
            message: error.message || 'Internal Server Error'
        }
    }

    if (config.env === 'development') {
        response.error.stack = error.stack
    }

    return res.status(statusCode).send(response)
}

module.exports = {
    errorHandler
}
