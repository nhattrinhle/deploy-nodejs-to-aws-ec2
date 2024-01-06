const app = require('./src/app')
const config = require('./src/config/config')
const logger = require('./src/config/logger')

const PORT = config.port

const server = app.listen(PORT, () => {
    logger.info(`Server is running on PORT::${PORT}`)
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed')
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.info(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
