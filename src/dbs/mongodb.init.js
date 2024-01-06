const mongoose = require('mongoose')
const config = require('../config/config')

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
            console.log('Connected to MongoDB successfully!')
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error.message)
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
