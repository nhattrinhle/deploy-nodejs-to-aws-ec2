const { User } = require('../models')
const { BadRequestError } = require('../core/error.response')
const { createNewUserKey, generateUserKeyPair } = require('./token.service')
const { generateVerifyEmailToken } = require('../utils')
const { sendVerificationEmail } = require('./email.service')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<{ User }>}
 */
const createUser = async (userBody) => {
    const { username, email } = userBody

    const isUsernameTaken = await User.isUsernameTaken(username)
    if (isUsernameTaken) {
        throw new BadRequestError('Username already taken')
    }

    const isEmailTaken = await User.isEmailTaken(email)
    if (isEmailTaken) {
        throw new BadRequestError('Email already taken')
    }

    const newUser = await User.create(userBody)
    if (!newUser) {
        throw new BadRequestError('Register failed')
    }

    const { _id: userId } = newUser
    const { privateKey, publicKey } = generateUserKeyPair()
    const newUserKey = await createNewUserKey({ userId, privateKey, publicKey })
    if (!newUserKey) {
        throw new BadRequestError('Creating user key failed')
    }

    const { uniqueString, hashUniqueString } = await generateVerifyEmailToken(userId)

    await newUser.updateOne({
        emailVerificationCode: {
            code: hashUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * 60 * 1000
        }
    })

    const sentEmail = await sendVerificationEmail({ userId, email, token: uniqueString })
    if (!sentEmail) {
        throw new BadRequestError('An error occurred when sent verification email to your email address')
    }

    return { newUser }
}

module.exports = {
    createUser
}
