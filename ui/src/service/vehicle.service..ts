import { apiClient } from "@/lib/api";
import type {
  Vehicle,
  VehicleCreateData,
  VehicleUpdateData,
} from "@/types/vehicle.type";

export const vehicleService = {
  getVehicles: async () => {
    return await apiClient.get<{ data: Vehicle[] }>("/vehicles");
  },

  getVehicle: async (id: number) => {
    return await apiClient.get<{ data: Vehicle }>(`/vehicles/${id}`);
  },

  createVehicle: async (data: VehicleCreateData) => {
    return await apiClient.post<{ data: Vehicle }>("/vehicles", data);
  },

  updateVehicle: async (id: number, data: VehicleUpdateData) => {
    return await apiClient.put<{ data: Vehicle }>(`/vehicles/${id}`, data);
  },

  deleteVehicle: async (id: number) => {
    return await apiClient.delete(`/vehicles/${id}`);
  },
};
