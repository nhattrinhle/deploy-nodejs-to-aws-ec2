const app = require('./src/app')
const config = require('./src/config/config')
const logger = require('./src/config/logger')

const PORT = config.port

app.listen(PORT, () => {
    logger.info(`Server is running on PORT::${PORT}`)
})
