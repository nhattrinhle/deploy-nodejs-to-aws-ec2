const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metaData = {} }) {
        this.status = statusCode
        this.message = message || reasonStatusCode
        this.metaData = metaData
    }

    send(res) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metaData }) {
        super({ message, metaData })
    }
}

class Created extends SuccessResponse {
    constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metaData }) {
        super({ message, statusCode, reasonStatusCode, metaData })
    }
}

module.exports = {
    SuccessResponse,
    OK,
    Created
}
