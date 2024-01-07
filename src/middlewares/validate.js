const Joi = require('joi')
const { BadRequestError } = require('../core/error.response')
const { getExistingKeysInObject } = require('../utils')

const validate = (schema) => (req, res, next) => {
    try {
        const validSchema = getExistingKeysInObject(schema, ['params', 'query', 'body'])
        const object = getExistingKeysInObject(req, ['params', 'query', 'body'])

        const hasValidSchema = Object.keys(validSchema).length > 0
        if (!hasValidSchema) {
            return next(new BadRequestError('Invalid validation schema.'))
        }

        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(object)
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ')
            return next(new BadRequestError(errorMessage))
        }
        Object.assign(req, value)
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = validate
