const { User } = require('../models')
const { BadRequestError } = require('../core/error.response')
const { generateUserToken } = require('./token.service')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User, Token>}
 */
const createUser = async (userBody) => {
    const isEmailTaken = await User.isEmailTaken(userBody.email)
    if (isEmailTaken) {
        throw new BadRequestError('Email already taken')
    }

    const newUser = await User.create(userBody)
    if (!newUser) {
        throw new BadRequestError('Register failed')
    }

    const { _id: userId, email } = newUser
    const tokens = await generateUserToken(userId, email)
    if (!tokens) {
        throw new BadRequestError('Creating tokens failed')
    }

    return { newUser, tokens }
}

/**
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new BadRequestError('User not registered!')
    }

    return user
}

module.exports = {
    createUser,
    getUserByEmail
}
