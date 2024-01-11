const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const logger = require('../config/logger')
const { BadRequestError, NotFoundError, AuthFailureError } = require('../core/error.response')
const { userRepo } = require('../models/repos')

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
    const sent = await transporter.sendMail(msg)
    if (!sent) {
        throw new BadRequestError('Error sending to email address')
    }

    return sent
}

/**
 * Send verification email
 * @param {string} email
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async ({ userId, email, token }) => {
    const subject = 'Email Verification'
    const verificationEmailUrl = `http://localhost:3000/v1/api/email/verify-email/${userId}/${token}`
    const text = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}. If you did not create an account, then ignore this email.`
    const html = `<p> Dear user, </p>
    <p> To verify your email, click on this link:  <a href="${verificationEmailUrl}">here</a> </p>
    <p> This link expires in 30 minutes </p>
    <p> If you did not create an account, then ignore this email.</p>`

    const info = await sendEmail({ to: email, subject, text, html })
    if (!info) {
        throw new BadRequestError('Error sending to email address')
    }

    return info
}

const verifyEmail = async (userId, token) => {
    const foundUser = await userRepo.getUserDocumentById(userId)
    if (!foundUser) {
        throw new NotFoundError('Email not registered')
    }

    const verificationCode = foundUser.emailVerificationCode
    if (!verificationCode && foundUser.isEmailVerified) {
        throw new BadRequestError('Account does not need to verification email!')
    }

    const { code: userVerificationCode, expiresAt } = verificationCode
    if (!userVerificationCode) {
        throw new AuthFailureError('An error occurred when verify your email address!')
    }

    if (expiresAt < Date.now()) {
        await foundUser.updateOne({ emailVerificationCode: null })
        throw new AuthFailureError('Your email verification link has expired! Please inbox!')
    }

    const isMatchToken = bcrypt.compare(userVerificationCode, token)
    if (!isMatchToken) {
        throw new AuthFailureError(
            'An error occurred when verify your email address! User verification link is incorrect'
        )
    }

    const updatedUser = await foundUser.updateOne({
        $set: {
            isActive: true,
            isEmailVerified: true
        },
        $unset: {
            emailVerificationCode: 1
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
