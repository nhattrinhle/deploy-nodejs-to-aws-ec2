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

const getUserDocumentById = async (userId) => {
    return User.findOne({ _id: convertToObjectId(userId) })
}

const deleteUserById = async (userId) => {
    return User.deleteOne({ _id: convertToObjectId(userId) })
}

module.exports = {
    getUserObjById,
    getUserObjByEmail,
    getUserDocumentById,
    getUserDocumentByEmail,
    deleteUserById
}
