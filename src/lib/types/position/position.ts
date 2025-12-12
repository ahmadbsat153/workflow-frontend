import { Meta } from "../common";
import { Department } from "../department/department";

export type Position = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  departmentId?: Department;
  level?: number;
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PositionTable = {
  data: Position[];
  meta: Meta;
};

export type PositionOption = {
  _id: string;
  name: string;
  code: string;
  departmentId: string;
};
