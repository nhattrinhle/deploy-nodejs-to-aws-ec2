const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(statusCode, message) {
        super(message)
        this.status = statusCode
    }
}

class BadRequestError extends ErrorResponse {
    constructor(statusCode = StatusCodes.BAD_REQUEST, message = ReasonPhrases.BAD_REQUEST) {
        super(statusCode, message)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(statusCode = StatusCodes.UNAUTHORIZED, message = ReasonPhrases.UNAUTHORIZED) {
        super(statusCode, message)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(statusCode = StatusCodes.FORBIDDEN, message = ReasonPhrases.FORBIDDEN) {
        super(statusCode, message)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(statusCode = StatusCodes.NOT_FOUND, message = ReasonPhrases.NOT_FOUND) {
        super(statusCode, message)
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(statusCode = StatusCodes.CONFLICT, message = ReasonPhrases.CONFLICT) {
        super(statusCode, message)
    }
}

module.exports = {
    ErrorResponse,
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
    ConflictRequestError
}
