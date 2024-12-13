import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { VehicleService } from '../services/VehicleService';

const vehicleServiceInstance = new VehicleService();

export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleServiceInstance.create(req.body);
  res.status(201).json(vehicle);
});
