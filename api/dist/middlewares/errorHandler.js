"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../utils/logger"));
const errorResponse_1 = require("../utils/errorResponse");
const errorResponses_1 = require("../errors/errorResponses");
function errorHandler(err, req, res, next) {
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body || {},
    });
    // generic HTTP error mapping for potential customization
    const genericErrorMap = {
        ValidationError: { message: "Invalid input data", statusCode: 400 },
        UnauthorizedError: { message: "Unauthorized access", statusCode: 401 },
    };
    // Prisma error handling with a detailed map
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const prismaErrorMap = {
            P2002: {
                message: "Duplicate field value: Unique constraint failed",
                statusCode: 409,
            },
            P2025: { message: "Record not found", statusCode: 404 },
            P2003: { message: "Foreign key constraint violation", statusCode: 400 },
        };
        const { message, statusCode } = prismaErrorMap[err.code] || {
            message: "Database error",
            statusCode: 500,
        };
        return res.status(statusCode).json(Object.assign({ status: "fail", error: { message } }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
    }
    // ErrorResponse handling
    if (err instanceof errorResponse_1.ErrorResponse) {
        return res.status(err.statusCode).json(Object.assign({ status: err.statusCode >= 500 ? "error" : "fail", error: { message: err.message } }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
    }
    if (err instanceof errorResponses_1.NotFoundError) {
        return res.status(404).json(Object.assign({ status: 404 >= 500 ? "error" : "fail", error: { message: err.message } }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
    }
    const genericError = genericErrorMap[err.name] || {
        message: "Internal server error",
        statusCode: 500,
    };
    return res.status(genericError.statusCode).json(Object.assign({ status: genericError.statusCode >= 500 ? "error" : "fail", error: { message: genericError.message } }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
}
