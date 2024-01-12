const { Schema, model } = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const USER_DOCUMENT_NAME = 'user'
const USER_COLLECTION_NAME = 'users'
const SALT_ROUND = 10

const addressSchema = new Schema(
    {
        province: String,
        district: String,
        ward: String,
        road: String,
        note: String,
        phone: String
    },
    {
        _id: false
    }
)

const verificationEmailSchema = new Schema(
    {
        code: String,
        createdAt: Date,
        expiresAt: Date
    },
    {
        _id: false
    }
)

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email')
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number')
                }
            },
            private: true
        },
        fullName: String,
        roles: [String],
        address: [addressSchema],
        isActive: {
            type: Boolean,
            default: false
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        verificationEmail: verificationEmailSchema
    },
    {
        timestamps: true,
        collection: USER_COLLECTION_NAME
    }
)
/**
 * Check if email is taken
 * @param {string} email
 * @returns {Promise<boolean}
 */
userSchema.statics.isEmailTaken = async function (email) {
    return !!(await this.findOne({ email }).lean())
}

/**
 * Check if username is taken
 * @param {string} username
 * @returns {Promise<boolean}
 */
userSchema.statics.isUsernameTaken = async function (username) {
    return !!(await this.findOne({ username }).lean())
}

/**
 *
 * @param {string} password
 * @returns {Promise<Boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, SALT_ROUND)
    }
    next()
})

/**
 * @typedef User
 */
const User = model(USER_DOCUMENT_NAME, userSchema)

module.exports = User
