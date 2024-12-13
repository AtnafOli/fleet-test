import { useVehicles } from "@/hooks/user_vehicle";
import { VehicleTableHeader } from "./header";
import { VehicleTableContent } from "./content";
import { VehicleTablePagination } from "./pagination";
import { VehicleUpdateModal } from "./updatemodel";
import { VehicleDeleteModal } from "./deletemodal";
import { useVehicleTableState } from "@/hooks/vehicle/use_vehicle_state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import type { VehicleUpdateData } from "@/types/vehicle.type";

export function VehicleTable() {
  const { toast } = useToast();
  const {
    vehicles,
    isLoading,
    updateVehicle,
    deleteVehicle,
    isUpdating,
    isDeleting,
    error,
    updateError,
    deleteError,
  } = useVehicles();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    paginatedVehicles,
    totalPages,
    filteredAndSortedVehicles,
    selectedVehicle,
    setSelectedVehicle,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  } = useVehicleTableState(vehicles);

  const handleUpdate = async (data: VehicleUpdateData) => {
    if (!selectedVehicle) return;

    try {
      await updateVehicle({ id: selectedVehicle.id, data });
      setIsUpdateModalOpen(false);
      setSelectedVehicle(null);
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: updateError?.message || "Failed to update vehicle",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVehicle(id);
      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: deleteError?.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <VehicleTableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <VehicleTableContent
        vehicles={paginatedVehicles}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        onEdit={(vehicle) => {
          setSelectedVehicle(vehicle);
          setIsUpdateModalOpen(true);
        }}
        onDelete={(vehicle) => {
          setSelectedVehicle(vehicle);
          setIsDeleteModalOpen(true);
        }}
        isDeleting={isDeleting}
      />

      <VehicleTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAndSortedVehicles.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
      />

      <VehicleUpdateModal
        vehicle={selectedVehicle}
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

      <VehicleDeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={() => selectedVehicle && handleDelete(selectedVehicle.id)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
