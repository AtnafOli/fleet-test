import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { VehicleService } from '../services/VehicleService';

const vehicleServiceInstance = new VehicleService();

export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await vehicleServiceInstance.delete(parseInt(id));
  res.status(204).send();
});
