const { Types } = require('mongoose')

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
    getExistingKeysInObject,
    convertToObjectId
}
