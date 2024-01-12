const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const logger = require('../config/logger')
const { BadRequestError, NotFoundError, AuthFailureError, FailedDependenciesError } = require('../core/error.response')
const { userRepo } = require('../models/repos')

const emailConfig = {
    from: config.email.from,
    verificationUrl: config.email.verificationUrl
}

const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: true,
    secureConnection: false,
    auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass
    },
    tls: {
        rejectUnauthorized: true
    }
})

transporter
    .verify()
    .then(() => {
        logger.info('Connected Nodemailer')
    })
    .catch(() => {
        logger.error('Unable to connect to Nodemailer!')
    })

const sendEmail = async ({ to, subject, text, html }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!to || typeof to !== 'string' || !emailRegex.test(to)) {
        throw new BadRequestError('Invalid or missing recipient email address')
    }

    const msg = { from: config.email.from, to, subject, text, html }
    const info = await transporter.sendMail(msg)

    if (!info.messageId) {
        throw new FailedDependenciesError('Error sending email')
    }

    return info
}

/**
 * Send verification email
 * @param {string} email
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async ({ userId, email, token }) => {
    const subject = 'Email Verification'
    const verificationEmailUrl = `${emailConfig.verificationUrl}/${userId}/${token}`
    const text = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}. If you did not create an account, then ignore this email.`
    const html = `<p> Dear user, </p>
    <p> To verify your email, click on this link:  <a href="${verificationEmailUrl}">here</a> </p>
    <p> This link expires in 30 minutes </p>
    <p> If you did not create an account, then ignore this email.</p>`

    const info = await sendEmail({ to: email, subject, text, html })
    if (!info) {
        throw new FailedDependenciesError('Error sending verification email')
    }

    return info
}

const verifyEmail = async (userId, token) => {
    const foundUser = await userRepo.getUserDocumentById(userId)
    if (!foundUser) {
        throw new NotFoundError('Email not registered')
    }

    const { verificationEmail, isEmailVerified } = foundUser

    if (!verificationEmail && isEmailVerified) {
        throw new BadRequestError('Account does not need to verification email!')
    }

    const { code, expiresAt } = verificationEmail
    if (!code) {
        throw new AuthFailureError('An error occurred when verify your email address!')
    }

    if (expiresAt < Date.now()) {
        await foundUser.updateOne({ $unset: { verificationEmail: 1 } })
        throw new BadRequestError('Your email verification link has expired! Please inbox!')
    }

    const isTokenMatch = await bcrypt.compare(token, code)
    if (!isTokenMatch) {
        throw new BadRequestError(
            'An error occurred when verify your email address! User verification link is incorrect'
        )
    }

    const updatedUser = await foundUser.updateOne({
        $set: {
            isActive: true,
            isEmailVerified: true
        },
        $unset: {
            verificationEmail: 1
        }
    })

    if (!updatedUser) {
        throw new BadRequestError('An error occurred when updating user model')
    }
}

module.exports = {
    sendVerificationEmail,
    verifyEmail
}
