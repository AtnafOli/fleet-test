"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_1 = require("./modules/vehicle");
const router = express_1.default.Router();
router.use("/vehicles", vehicle_1.vehicleRouter);
exports.default = router;
