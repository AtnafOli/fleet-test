"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
/**
 * Sends a structured JSON response.
 *
 * @template T
 * @param {ResponseHandlerOptions<T>} options
 */
const responseHandler = ({ res, statusCode, data = {}, error = null, message = "Success", }) => {
    const response = {
        success: !error,
        data: data || null,
        error: error || null,
        message: message || (error ? "An error occurred" : "Success"),
        timestamp: new Date().toISOString(),
        statusCode,
    };
    res.status(statusCode).json(response);
};
exports.responseHandler = responseHandler;
