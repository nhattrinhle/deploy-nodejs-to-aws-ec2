const { User } = require('../models')
const { BadRequestError, FailedDependenciesError } = require('../core/error.response')
const { createNewUserKey, generateUserKeyPair } = require('./token.service')
const { generateVerifyEmailToken } = require('../utils')
const { sendVerificationEmail } = require('./email.service')
const { userRepo, tokenRepo } = require('../models/repos')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<{ User }>}
 */
const createUser = async (userBody) => {
    let userId
    try {
        const { username, email } = userBody

        const [isUsernameTaken, isEmailTaken] = await Promise.all([
            User.isUsernameTaken(username),
            User.isEmailTaken(email)
        ])

        if (isUsernameTaken || isEmailTaken) {
            throw new BadRequestError('Username or email already taken')
        }

        const newUser = await User.create(userBody)
        if (!newUser) {
            throw new BadRequestError('Register failed')
        }

        userId = newUser._id

        const { privateKey, publicKey } = generateUserKeyPair()
        const newUserKey = await createNewUserKey({ userId, privateKey, publicKey })
        if (!newUserKey) {
            throw new BadRequestError('Creating user key failed')
        }

        const { uniqueString, hashUniqueString } = await generateVerifyEmailToken(userId)

        await newUser.updateOne({
            verificationEmail: {
                code: hashUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 30 * 60 * 1000
            }
        })

        const sentEmail = await sendVerificationEmail({ userId, email, token: uniqueString })
        if (!sentEmail) {
            throw new FailedDependenciesError('Error sending verification email')
        }

        return { newUser }
    } catch (error) {
        if (userId) {
            await Promise.all([userRepo.deleteUserById(userId), tokenRepo.deleteUserTokens(userId)])
        }
        throw error
    }
}

module.exports = {
    createUser
}
