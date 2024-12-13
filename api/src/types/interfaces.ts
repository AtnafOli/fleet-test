import { RoleEnum } from "@prisma/client";

export interface AdvancedResults {
  success: boolean;
  count: number;
  pagination: any;
  data: any[];
}

export interface User {
  id: number;
  role: RoleEnum;
}
