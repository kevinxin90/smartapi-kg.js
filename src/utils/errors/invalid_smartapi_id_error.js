class InvalidSmartAPIIDError extends Error {
    constructor(message = "The SmartAPI ID you provided is invalid.", ...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidQueryGraphError);
        }

        this.name = 'InvalidSmartAPIIDError';
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = InvalidSmartAPIIDError;