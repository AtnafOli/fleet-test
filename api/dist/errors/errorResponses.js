"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message = "Internal server error", statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorResponse = ErrorResponse;
class NotFoundError extends ErrorResponse {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends ErrorResponse {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ErrorResponse {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
