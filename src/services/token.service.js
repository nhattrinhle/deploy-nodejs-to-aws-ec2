const JWT = require('jsonwebtoken')
const { generateKeyPairSync } = require('node:crypto')
const config = require('../config/config')
const Token = require('../models/token.model')
const { BadRequestError } = require('../core/error.response')

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

const createKey = async ({ userId, publicKey, refreshToken }) => {
    const filter = {
        user: userId
    }
    const update = {
        publicKey,
        refreshToken,
        refreshTokensUsed: []
    }
    const options = {
        upsert: true,
        new: true
    }
    const keys = await Token.findOneAndUpdate(filter, update, options)
    return keys ? keys.publicKey : null
}

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

const generateUserToken = async (userId, email, refreshToken = null) => {
    const { privateKey, publicKey } = generateUserKeyPair()
    const publicKeyStored = await createKey({ userId, publicKey, refreshToken })
    if (!publicKeyStored) {
        throw new BadRequestError('Creating public key failed')
    }
    const tokens = await generateTokens({ payload: { userId, email }, privateKey })
    if (!tokens) {
        throw new BadRequestError('Creating tokens failed')
    }

    return tokens
}

module.exports = {
    generateUserKeyPair,
    createKey,
    generateTokens,
    generateUserToken
}
