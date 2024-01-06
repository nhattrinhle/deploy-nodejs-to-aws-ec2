const mongoose = require('mongoose')
const config = require('../config/config')
const logger = require('../config/logger')

class Database {
    constructor() {
        Database.connect()
    }

    static async connect() {
        const connectionString = config.mongoose.url

        try {
            if (config.env === 'development') {
                mongoose.set('debug', true)
                mongoose.set('debug', { color: true })
            }
            await mongoose.connect(connectionString)
            logger.info('Connected to MongoDB successfully!')
        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error.message)
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database()
        }
        return this.instance
    }
}

const instanceMongoDB = Database.getInstance()
module.exports = instanceMongoDB
