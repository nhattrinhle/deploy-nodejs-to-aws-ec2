const User = require('../user.model')
const { convertToObjectId } = require('../../utils/index')

const getUserObjById = async (userId) => {
    return User.findOne({ _id: convertToObjectId(userId) }).lean()
}

const getUserObjByEmail = async (email) => {
    return User.findOne({ email }).lean()
}

const getUserDocumentByEmail = async (email) => {
    return User.findOne({ email })
}

module.exports = {
    getUserObjById,
    getUserObjByEmail,
    getUserDocumentByEmail
}
