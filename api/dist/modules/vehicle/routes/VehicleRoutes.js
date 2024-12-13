"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const advancedQuery_1 = __importDefault(require("../../../middlewares/advancedQuery"));
const router = (0, express_1.Router)();
// Create a new Vehicle
router.post("/", controllers_1.createVehicle);
// Get all Vehicles with advanced query
router.get("/", (0, advancedQuery_1.default)("vehicles"), controllers_1.getResultVehicles);
// Update a Vehicle by ID
router.put("/:id", controllers_1.updateVehicle);
// Delete a Vehicle by ID
router.delete("/:id", controllers_1.deleteVehicle);
exports.default = router;
