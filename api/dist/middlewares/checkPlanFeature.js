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
exports.checkPlanFeature = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorResponse_1 = require("../utils/errorResponse");
const db_server_1 = require("../utils/db.server");
const client_1 = require("@prisma/client");
/**
 * Middleware to check if the user has access to a specific feature based on their subscription.
 */
const checkPlanFeature = (featureId) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new errorResponse_1.ErrorResponse("User not authorized", 401));
    }
    const vendorId = req.user.id;
    try {
        const hasFeature = yield checkIfUserHasFeature(vendorId, featureId);
        if (!hasFeature) {
            return next(new errorResponse_1.ErrorResponse("Access to this feature is not allowed", 403));
        }
    }
    catch (err) {
        return next(err);
    }
    next();
}));
exports.checkPlanFeature = checkPlanFeature;
/**
 * Check if the user has access to a specific feature based on their active plan.
 */
function checkIfUserHasFeature(vendorId, featureId) {
    return __awaiter(this, void 0, void 0, function* () {
        const vendorPlan = yield db_server_1.db.subscription.findFirst({
            where: {
                userId: vendorId,
                status: client_1.SubscriptionStatus.active,
            },
        });
        if (!vendorPlan) {
            throw new errorResponse_1.ErrorResponse("No active plan found for this vendor", 404);
        }
        console.log(vendorPlan.id);
        console.log(featureId);
        const featureAssignment = yield db_server_1.db.planFeatureAssignment.findFirst({
            where: {
                featureId: featureId,
                planId: vendorPlan.planId,
            },
        });
        if (!featureAssignment) {
            throw new errorResponse_1.ErrorResponse("You are not allowed to access this feature. Please upgrade your plan!", 403);
        }
        return true;
    });
}
