const Token = require('../token.model')
const { convertToObjectId } = require('../../utils')

const updateUserTokens = async (userId, newRefreshToken) => {
    const updatedToken = await Token.findOneAndUpdate({ user: userId }, { $push: { refreshTokens: newRefreshToken } })

    return updatedToken
}

const getUserPrivateKeyByUserId = async (userId) => {
    const userTokens = await Token.findOne({ user: convertToObjectId(userId) }).lean()

    return userTokens?.privateKey
}

const deleteUserTokens = async (userId) => {
    return Token.deleteOne({ user: convertToObjectId(userId) })
}

module.exports = {
    getUserPrivateKeyByUserId,
    updateUserTokens,
    deleteUserTokens
}
