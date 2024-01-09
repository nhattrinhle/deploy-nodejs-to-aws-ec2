const JWT = require('jsonwebtoken')
const { AuthFailureError } = require('../core/error.response')
const { tokenService } = require('../services')
const { userRepo } = require('../models/repos')

const HEADER = {
    USER_ID: 'x-user-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-user-refreshtoken'
}

const authentication = async (req, res, next) => {
    try {
        const userId = req.headers[HEADER.USER_ID]
        if (!userId) {
            throw new AuthFailureError('Invalid request')
        }

        const foundUser = await userRepo.getUserObjById(userId)

        if (!foundUser) {
            throw new AuthFailureError('Not found user')
        }

        const userTokens = await tokenService.findUserTokens(userId)
        if (!userTokens) {
            throw new AuthFailureError('Not found user keys')
        }

        const { publicKey: userPublicKey } = userTokens
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN]

        if (refreshToken && userTokens.refreshTokens.include(refreshToken)) {
            const decodeUser = JWT.verify(refreshToken, userPublicKey)
            if (userId !== decodeUser.payload.userId) {
                throw new AuthFailureError('Invalid UserId')
            }

            req.user = decodeUser.payload
            req.userTokens = userTokens
            req.refreshToken = refreshToken

            return next()
        }

        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if (!accessToken) {
            throw new AuthFailureError('Invalid Request')
        }

        const decodeUser = JWT.verify(accessToken, userPublicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid UserId')
        }

        req.user = decodeUser
        req.userTokens = userTokens
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    authentication
}
