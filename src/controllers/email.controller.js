const { OK } = require('../core/success.response')
const { emailService } = require('../services')

// const sendVerificationEmail = async (req, res) => {
//     const result = await emailService.sendVerificationEmail(req.body.email)
//     new OK({
//         message: 'Send Email Success! Pending for verifying email success!',
//         metaData: result
//     }).send(res)
// }

const verifyEmail = async (req, res) => {
    const { userId, token } = req.params
    const result = await emailService.verifyEmail(userId, token)
    new OK({
        message: 'Verify email successfully!',
        metaData: result
    }).send(res)
}

module.exports = {
    // sendVerificationEmail,
    verifyEmail
}
