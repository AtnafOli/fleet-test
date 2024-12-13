import { useState } from "react";
import { VehicleTable } from "@/components/table/vehicle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { VehicleForm } from "@/components/forms/vehicle/CreateVehicle";
import { useToast } from "@/hooks/use-toast";
import { useVehicles } from "@/hooks/user_vehicle";
import type { VehicleCreateData } from "@/types/vehicle.type";

import { Card, CardContent } from "@/components/ui/card";

export function VehiclePage() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createVehicle, isCreating, createError, vehicles } = useVehicles();

  const handleCreate = async (data: VehicleCreateData) => {
    try {
      await createVehicle(data);
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Vehicle created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: createError?.message || "Failed to create vehicle",
        variant: "destructive",
      });
    }
  };

  const totalVehicles = vehicles?.length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Vehicles
            </h3>
            <p className="text-2xl font-bold">{totalVehicles}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Fleet Management</h2>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button disabled={isCreating}>
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Add Vehicle"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Vehicle</DialogTitle>
                <DialogDescription>
                  Add a new vehicle to the fleet management system
                </DialogDescription>
              </DialogHeader>
              <VehicleForm onSubmit={handleCreate} isLoading={isCreating} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <VehicleTable />
      </div>
    </div>
  );
}
