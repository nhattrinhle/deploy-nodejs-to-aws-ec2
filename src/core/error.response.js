const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message)
        this.status = statusCode
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode)
    }
}

class TooManyRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.TOO_MANY_REQUESTS, statusCode = StatusCodes.TOO_MANY_REQUESTS) {
        super(message, statusCode)
    }
}

module.exports = {
    ErrorResponse,
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
    ConflictRequestError,
    TooManyRequestError
}
