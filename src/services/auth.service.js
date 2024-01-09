const { AuthFailureError, ForbiddenError, NotFoundError } = require('../core/error.response')
const { userRepo } = require('../models/repos')
const { createAuthTokens, deleteUserTokens, updateUserRefreshTokens } = require('./token.service')
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

    const newTokens = await createAuthTokens({ userId, email, refreshToken })

    const updated = await updateUserRefreshTokens({ userId, newTokens, refreshTokenUsed: refreshToken })
    if (!updated) {
        throw new BadRequestError('Something wrong happen!!')
    }

    return { user, newTokens }
}

module.exports = {
    loginWithEmailAndPassword,
    refreshTokens
}
