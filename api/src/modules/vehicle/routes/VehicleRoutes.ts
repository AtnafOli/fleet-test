import { Router } from "express";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getResultVehicles,
} from "../controllers";
import advancedQuery from "../../../middlewares/advancedQuery";

const router = Router();

// Create a new Vehicle
router.post("/", createVehicle);

// Get all Vehicles with advanced query
router.get("/", advancedQuery("vehicles"), getResultVehicles);

// Update a Vehicle by ID
router.put("/:id", updateVehicle);

// Delete a Vehicle by ID
router.delete("/:id", deleteVehicle);

export default router;
