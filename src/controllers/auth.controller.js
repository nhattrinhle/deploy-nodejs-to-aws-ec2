const { Created } = require('../core/success.response')
const { createUser } = require('../services/user.service')

const register = async (req, res) => {
    const user = await createUser(req.body)
    new Created({
        message: 'Register successfully!',
        metaData: user
    }).send(res)
}

module.exports = {
    register
}
