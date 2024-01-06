const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class SuccessResponse {
    constructor({ statusCode = StatusCodes.OK, message, reasonStatusCode = ReasonPhrases.OK, metaData = {} }) {
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
    constructor({ statusCode = StatusCodes.CREATED, message, reasonStatusCode = ReasonPhrases.CREATED, metaData }) {
        super({ statusCode, message, reasonStatusCode, metaData })
    }
}

module.exports = {
    SuccessResponse,
    OK,
    Created
}
