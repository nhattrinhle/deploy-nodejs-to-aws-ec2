const { Created, OK } = require('../core/success.response')
const { createUser } = require('../services/user.service')
const { authService } = require('../services')

const register = async (req, res) => {
    const user = await createUser(req.body)
    new Created({
        message: 'Register successfully!',
        metaData: user
    }).send(res)
}

const login = async (req, res) => {
    const { email, password } = req.body
    const userInfo = await authService.loginWithEmailAndPassword(email, password)
    new OK({
        message: 'Login successfully!',
        metaData: userInfo
    }).send(res)
}

const refreshUserTokens = async (req, res) => {
    const { user, refreshToken, userTokens } = req
    const newTokens = await authService.refreshTokens({
        user,
        refreshToken,
        refreshTokensUsed: userTokens.refreshTokensUsed
    })
    return new OK({
        message: 'Generate new tokens success',
        metaData: newTokens
    }).send(res)
}

module.exports = {
    register,
    login,
    refreshUserTokens
}
