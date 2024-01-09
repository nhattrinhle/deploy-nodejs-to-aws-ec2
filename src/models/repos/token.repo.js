const Token = require('../token.model')
const { convertToObjectId } = require('../../utils')

const getUserPrivateKeyByUserId = async (userId) => {
    const userTokens = await Token.findOne({ user: convertToObjectId(userId) }).lean()

    return userTokens.privateKey
}

module.exports = {
    getUserPrivateKeyByUserId
}
