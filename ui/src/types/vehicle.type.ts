export interface Vehicle {
  id: number;
  name: string;
  plateNumber: string;
  status: StatusEnum;
}

export enum StatusEnum {
  Available = "AVAILABLE",
  Pending = "PENDING",
  Sold = "SOLD",
  InActive = "INACTIVE",
}

export interface VehicleCreateData {
  name: string;
  plateNumber: string;
  status: StatusEnum;
}

export interface VehicleUpdateData {
  name?: string;
  plateNumber?: string;
  status?: StatusEnum;
}
