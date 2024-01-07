const { AuthFailureError } = require('../core/error.response')
const { getUserByEmail } = require('./user.service')
const { generateUserToken } = require('./token.service')
const { BadRequestError } = require('../core/error.response')

const loginWithEmailAndPassword = async (email, password) => {
    try {
        const user = await getUserByEmail(email)
        if (!user) {
            throw new AuthFailureError('Authentication Error')
        }

        const isMatch = await user.isPasswordMatch(password)
        if (!isMatch) {
            throw new AuthFailureError('Authentication Error')
        }

        const { _id: userId } = user
        const tokens = await generateUserToken(userId, email)
        if (!tokens) {
            throw new BadRequestError('Creating tokens failed')
        }

        return { user, tokens }
    } catch (error) {
        throw new AuthFailureError('Authentication Error! Something went wrong!')
    }
}

module.exports = {
    loginWithEmailAndPassword
}
