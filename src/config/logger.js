const winston = require('winston')
const config = require('./config')

const { combine, splat, printf, colorize, uncolorize, timestamp } = winston.format
const isDevelopment = config.env === 'development'
const isProduction = config.env === 'production'

const formats = combine(
    timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A'
    }),
    colorize(),
    splat(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
)

const transports = isProduction
    ? [new winston.transports.Console()]
    : [
          new winston.transports.Console(),
          new winston.transports.File({
              dirname: 'logs',
              filename: 'tlshop.log',
              format: uncolorize()
          })
      ]

const logger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: formats,
    transports
})

module.exports = logger
