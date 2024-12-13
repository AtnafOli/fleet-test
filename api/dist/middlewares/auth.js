"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softAuth = exports.authorize = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_server_1 = require("../utils/db.server");
const errorResponse_1 = require("../utils/errorResponse");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let token;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token && ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.token)) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(new errorResponse_1.ErrorResponse("Not authorized to access this route", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield db_server_1.db.user.findUnique({
            where: { id: decoded.id },
            select: { role: true, id: true },
        });
        if (!user) {
            return next(new errorResponse_1.ErrorResponse("User not found", 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new errorResponse_1.ErrorResponse("Not authorized to access this resource", 403));
    }
}));
exports.auth = auth;
const softAuth = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let token;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token && ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.token)) {
        token = req.cookies.token;
    }
    if (!token) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield db_server_1.db.user.findUnique({
            where: { id: decoded.id },
            select: { role: true, id: true },
        });
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        return next(new errorResponse_1.ErrorResponse("Not authorized to access this resource", 403));
    }
}));
exports.softAuth = softAuth;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorResponse_1.ErrorResponse(`This user role is not authorized to access this resource`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
