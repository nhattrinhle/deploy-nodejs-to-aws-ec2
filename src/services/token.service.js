const JWT = require('jsonwebtoken')
const { generateKeyPairSync } = require('node:crypto')
const config = require('../config/config')
const Token = require('../models/token.model')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { convertToObjectId } = require('../utils')
const { tokenRepo } = require('../models/repos')

/**
 * Generate a new RSA key pair for a user
 * @returns {Object}
 */
const generateUserKeyPair = () => {
    const options = {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    }
    return generateKeyPairSync('rsa', options)
}

/**
 * Create or update user's keys in the database
 * @param {Object}  tokensInfo
 * @param {string}  tokensInfo.userId
 * @param {string}  tokensInfo.privateKey
 * @param {string}  tokensInfo.publicKey
 * @returns {Object<String>} storedPublicKey
 */
const createNewUserKey = async ({ userId, privateKey, publicKey }) => {
    const filter = {
        user: userId
    }
    const update = {
        privateKey,
        publicKey,
        refreshToken: [],
        refreshTokensUsed: []
    }
    const options = {
        upsert: true,
        new: true
    }
    const newUserKey = await Token.findOneAndUpdate(filter, update, options)

    return newUserKey
}

/**
 * Generate access and refresh tokens for a user.
 * @param {Object} tokenInfo
 * @param {Object} tokenInfo.payload
 * @param {String} tokenInfo.privateKey
 * @returns {Object}
 */
const generateTokens = async ({ payload, privateKey }) => {
    const accessTokenExpires = config.jwt.accessExpirationMinutes
    const accessTokenOptions = {
        algorithm: 'RS256',
        expiresIn: `${accessTokenExpires}m`
    }
    const accessToken = await JWT.sign(payload, privateKey, accessTokenOptions)

    const refreshTokenExpires = config.jwt.refreshExpirationDays
    const refreshTokenOptions = {
        algorithm: 'RS256',
        expiresIn: `${refreshTokenExpires}d`
    }
    const refreshToken = await JWT.sign({ type: 'refresh', payload }, privateKey, refreshTokenOptions)

    return { accessToken, refreshToken }
}

/**
 * Generate a new RSA key pair, store the public key, and generate access and refresh tokens for a user
 * @param {String} userId
 * @param {String} email
 * @param {String} refreshToken
 * @returns {Object}
 */
const createAuthTokens = async (userId, email) => {
    const userPrivateKey = await tokenRepo.getUserPrivateKeyByUserId(userId)
    if (!userPrivateKey) {
        throw new NotFoundError('Get User private Key failed!')
    }

    const tokens = await generateTokens({ payload: { userId, email }, privateKey: userPrivateKey })
    if (!tokens) {
        throw new BadRequestError('Creating tokens failed')
    }

    const updatedUserTokens = await tokenRepo.updateUserTokens(userId, tokens.refreshToken)
    if (!updatedUserTokens) {
        throw new BadRequestError('Updated refreshToken failed ')
    }

    return tokens
}

/**
 * Find publicKey, refreshToken and refreshTokensUsed of a user.
 * @param {String} userId
 * @returns {Object}
 */
const findUserTokens = async (userId) => {
    const foundTokens = await Token.findOne(
        { user: convertToObjectId(userId) },
        { publicKey: 1, refreshTokens: 1, refreshTokensUsed: 1 }
    ).lean()
    if (!foundTokens) {
        throw new BadRequestError('Not found user keys')
    }

    return foundTokens
}

/**
 * Delete accessToken, refresToken and publicKey of a user.
 * @param {String} userId
 * @returns {Promise<>}
 */
const deleteUserTokens = async (userId) => {
    const result = Token.deleteOne({ user: convertToObjectId(userId) })
    return result
}

const updateUserRefreshTokens = async ({ userId, newTokens, refreshTokenUsed }) => {
    const result = await Token.updateOne(
        { user: userId },
        {
            $set: {
                refreshToken: newTokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshTokenUsed
            }
        }
    )

    return result
}

module.exports = {
    generateUserKeyPair,
    generateTokens,
    createAuthTokens,
    findUserTokens,
    deleteUserTokens,
    updateUserRefreshTokens,
    createNewUserKey
}
