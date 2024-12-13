"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const errorResponses_1 = require("../errors/errorResponses");
const notFoundHandler = (req, res, next) => {
    next(new errorResponses_1.NotFoundError(`Route not found`));
};
exports.notFoundHandler = notFoundHandler;
