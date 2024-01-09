const Token = require('../token.model')
const { convertToObjectId } = require('../../utils')

const updateUserTokens = async (userId, newRefreshToken) => {
    const updatedToken = await Token.findOneAndUpdate({ user: userId }, { $push: { refreshToken: newRefreshToken } })

    return updatedToken
}

const getUserPrivateKeyByUserId = async (userId) => {
    const userTokens = await Token.findOne({ user: convertToObjectId(userId) }).lean()

    return userTokens.privateKey
}

module.exports = {
    getUserPrivateKeyByUserId,
    updateUserTokens
}
