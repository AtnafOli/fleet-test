import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { VehicleService } from '../services/VehicleService';

const vehicleServiceInstance = new VehicleService();

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const vehicle = await vehicleServiceInstance.update(parseInt(id), req.body);
  res.json(vehicle);
});
