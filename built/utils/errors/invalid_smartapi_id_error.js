"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSmartAPIIDError = void 0;
class InvalidSmartAPIIDError extends Error {
    constructor(message = "The SmartAPI ID you provided is invalid.", ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidSmartAPIIDError);
        }
        this.name = 'InvalidSmartAPIIDError';
        this.message = message;
        this.statusCode = 400;
    }
}
exports.InvalidSmartAPIIDError = InvalidSmartAPIIDError;
