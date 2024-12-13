import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VehicleForm } from "@/components/forms/vehicle/CreateVehicle";
import type { Vehicle, VehicleUpdateData } from "@/types/vehicle.type";

interface VehicleUpdateModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: VehicleUpdateData) => void;
  isUpdating: boolean;
}

export function VehicleUpdateModal({
  vehicle,
  isOpen,
  onOpenChange,
  onUpdate,
  isUpdating,
}: VehicleUpdateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Vehicle</DialogTitle>
          <DialogDescription>Update vehicle information</DialogDescription>
        </DialogHeader>
        {vehicle && (
          <VehicleForm
            defaultValues={{
              name: vehicle.name,
              plateNumber: vehicle.plateNumber,
              status: vehicle.status,
            }}
            onSubmit={onUpdate}
            isLoading={isUpdating}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
