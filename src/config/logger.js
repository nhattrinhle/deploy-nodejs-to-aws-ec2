const winston = require('winston')
const config = require('./config')

const { combine, splat, printf, colorize, uncolorize, timestamp } = winston.format
const isDevelopment = config.env === 'development'

const logger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        colorize(),
        splat(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'tlshop.log',
            format: combine(uncolorize())
        })
    ]
})

module.exports = logger
