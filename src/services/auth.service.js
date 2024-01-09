const { AuthFailureError, ForbiddenError, NotFoundError } = require('../core/error.response')
const { userRepo, tokenRepo } = require('../models/repos')
const { createAuthTokens, deleteUserTokens, updateUserRefreshTokens, generateTokens } = require('./token.service')
const { BadRequestError } = require('../core/error.response')

const loginWithEmailAndPassword = async (email, password) => {
    const foundUser = await userRepo.getUserDocumentByEmail(email)
    if (!foundUser) {
        throw new NotFoundError('Email not registered')
    }

    const isMatch = await foundUser.isPasswordMatch(password)
    if (!isMatch) {
        throw new AuthFailureError('Incorrect password')
    }

    const { _id: userId } = foundUser
    const tokens = await createAuthTokens(userId, email)

    return { foundUser, tokens }
}

const refreshTokens = async ({ user, refreshToken, refreshTokensUsed }) => {
    const unexpectedSignal = !!refreshTokensUsed.includes(refreshToken)
    const { userId, email } = user
    if (unexpectedSignal) {
        await deleteUserTokens(userId)
        throw new ForbiddenError('Something wrong happen! Please login against!')
    }

    const foundUser = await userRepo.getUserObjById(userId)
    if (!foundUser) {
        throw new AuthFailureError('User not registered!')
    }

    const userPrivateKey = await tokenRepo.getUserPrivateKeyByUserId(userId)
    if (!userPrivateKey) {
        throw new AuthFailureError('Something went wrong. Please login against')
    }

    const newTokens = await generateTokens({ payload: { userId, email }, privateKey: userPrivateKey })
    if (!newTokens) {
        throw new BadRequestError('Generate new access token failed')
    }

    const updated = await updateUserRefreshTokens({
        userId,
        oldRefreshToken: refreshToken,
        newRefreshToken: newTokens.refreshToken
    })
    if (!updated) {
        throw new BadRequestError('Something wrong happen!!')
    }

    return { user, newTokens }
}

module.exports = {
    loginWithEmailAndPassword,
    refreshTokens
}
