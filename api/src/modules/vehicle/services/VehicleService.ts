import { db } from "../../../utils/db.server";
import { CreateVehicle, UpdateVehicle } from "../types/VehicleTypes";

export class VehicleService {
  async create(data: CreateVehicle) {
    return db.vehicles.create({ data });
  }

  async findAll() {
    return db.vehicles.findMany();
  }

  async findOne(id: number) {
    return db.vehicles.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateVehicle) {
    return db.vehicles.update({ where: { id }, data });
  }

  async delete(id: number) {
    return db.vehicles.delete({ where: { id } });
  }
}
