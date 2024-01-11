const Joi = require('joi')

const verifyEmail = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
        token: Joi.string().required()
    })
}

module.exports = {
    verifyEmail
}
