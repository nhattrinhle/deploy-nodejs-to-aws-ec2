const { Types, model, Schema } = require('mongoose')

const TOKEN_DOCUMENT_NAME = 'token'
const TOKEN_COLLECTION_NAME = 'tokens'

const tokenSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'user',
            required: true,
            unique: true
        },
        privateKey: {
            type: String,
            required: true
        },
        publicKey: {
            type: String,
            required: true
        },
        refreshTokens: {
            type: Array,
            default: []
        },
        refreshTokensUsed: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
        collection: TOKEN_COLLECTION_NAME
    }
)

/**
 * @typedef Token
 */
const Token = model(TOKEN_DOCUMENT_NAME, tokenSchema)

module.exports = Token
