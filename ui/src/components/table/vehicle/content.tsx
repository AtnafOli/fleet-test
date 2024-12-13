import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Vehicle } from "@/types/vehicle.type";

interface VehicleTableContentProps {
  vehicles: Vehicle[];
  sortConfig: { key: keyof Vehicle; direction: "asc" | "desc" };
  setSortConfig: (config: {
    key: keyof Vehicle;
    direction: "asc" | "desc";
  }) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  isDeleting: boolean;
}

export function VehicleTableContent({
  vehicles,
  sortConfig,
  setSortConfig,
  onEdit,
  onDelete,
  isDeleting,
}: VehicleTableContentProps) {
  const handleSort = (key: keyof Vehicle) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Name{" "}
              {sortConfig.key === "name" && (
                <ChevronsUpDown className="inline h-4 w-4" />
              )}
            </TableHead>
            <TableHead
              onClick={() => handleSort("plateNumber")}
              className="cursor-pointer"
            >
              Plate Number{" "}
              {sortConfig.key === "plateNumber" && (
                <ChevronsUpDown className="inline h-4 w-4" />
              )}
            </TableHead>
            <TableHead
              onClick={() => handleSort("status")}
              className="cursor-pointer"
            >
              Status{" "}
              {sortConfig.key === "status" && (
                <ChevronsUpDown className="inline h-4 w-4" />
              )}
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No vehicles found
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.name}</TableCell>
                <TableCell>{vehicle.plateNumber}</TableCell>
                <TableCell>
                  <StatusBadge status={vehicle.status} />
                </TableCell>
                <TableCell>
                  <ActionsDropdown
                    vehicle={vehicle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    AVAILABLE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    UNAVAILABLE: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status as keyof typeof statusStyles]
      }`}
    >
      {status}
    </span>
  );
}

function ActionsDropdown({
  vehicle,
  onEdit,
  onDelete,
  isDeleting,
}: {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  isDeleting: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => onDelete(vehicle)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
