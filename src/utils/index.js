const { Types } = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

const generateVerifyEmailToken = async (_id) => {
    const uniqueString = uuidv4() + _id
    const roundsSalt = 10
    const hashUniqueString = await bcrypt.hash(uniqueString, roundsSalt)

    return { uniqueString, hashUniqueString }
}

const getExistingKeysInObject = (object, keys) => {
    return keys.reduce((newObj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key) && Object.keys(object[key]).length > 0) {
            return { ...newObj, [key]: object[key] }
        }

        return newObj
    }, {})
}

const convertToObjectId = (_id) => new Types.ObjectId(_id)

module.exports = {
    generateVerifyEmailToken,
    getExistingKeysInObject,
    convertToObjectId
}
