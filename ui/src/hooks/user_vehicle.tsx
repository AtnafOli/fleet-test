import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api";
import { vehicleService } from "@/service/vehicle.service.";
import type {
  Vehicle,
  VehicleCreateData,
  VehicleUpdateData,
} from "@/types/vehicle.type";

export function useVehicles() {
  const queryClient = useQueryClient();

  const {
    data: vehicles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await vehicleService.getVehicles();
      return response.data.data;
    },
  });

  const createVehicleMutation = useMutation<
    Vehicle,
    ApiError,
    VehicleCreateData
  >({
    mutationFn: async (data) => {
      const response = await vehicleService.createVehicle(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const updateVehicleMutation = useMutation<
    Vehicle,
    ApiError,
    { id: number; data: VehicleUpdateData }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await vehicleService.updateVehicle(id, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const deleteVehicleMutation = useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      await vehicleService.deleteVehicle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    createVehicle: createVehicleMutation.mutate,
    updateVehicle: updateVehicleMutation.mutate,
    deleteVehicle: deleteVehicleMutation.mutate,
    isCreating: createVehicleMutation.isPending,
    isUpdating: updateVehicleMutation.isPending,
    isDeleting: deleteVehicleMutation.isPending,
    createError: createVehicleMutation.error,
    updateError: updateVehicleMutation.error,
    deleteError: deleteVehicleMutation.error,
  };
}
