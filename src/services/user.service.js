const { User } = require('../models')
const { BadRequestError } = require('../core/error.response')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    const isEmailTaken = await User.isEmailTaken(userBody.email)
    if (isEmailTaken) {
        throw new BadRequestError('Email already taken')
    }
    return User.create(userBody)
}

module.exports = {
    createUser
}
