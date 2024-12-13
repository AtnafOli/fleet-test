import express from "express";
import { vehicleRouter } from "./modules/vehicle";

const router = express.Router();

router.use("/vehicles", vehicleRouter);

export default router;
