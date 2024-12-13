import { useState, useMemo } from "react";
import type { Vehicle } from "@/types/vehicle.type";

type SortConfig = {
  key: keyof Vehicle;
  direction: "asc" | "desc";
};

export function useVehicleTableState(vehicles: Vehicle[] | undefined) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = [...(vehicles || [])];

    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((vehicle) => vehicle.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vehicles, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredAndSortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    selectedVehicle,
    setSelectedVehicle,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    paginatedVehicles,
    totalPages,
    filteredAndSortedVehicles,
  };
}
