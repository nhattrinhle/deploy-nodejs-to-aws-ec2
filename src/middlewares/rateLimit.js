const rateLimit = require('express-rate-limit')
const { TooManyRequestError } = require('../core/error.response')

const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
    handler: () => {
        throw new TooManyRequestError('Too Many Request. Please try against after 15 minutes')
    }
})

module.exports = {
    authLimit
}
