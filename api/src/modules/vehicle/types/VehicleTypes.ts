import { VehicleStatus } from "@prisma/client";

export interface CreateVehicle {
  name: string;
  status: VehicleStatus;
  plateNumber: string;
}

export interface UpdateVehicle {
  name?: string;
  status?: VehicleStatus;
  plateNumber?: string;
}
