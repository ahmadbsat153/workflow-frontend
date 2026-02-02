import { Meta } from "../common";
import { BranchOption } from "../branch/branch";

export type Department = {
  _id: string;
  name: string;
  description?: string;
  code: string;
  branchId?: string | BranchOption | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentTable = {
  data: Department[];
  meta: Meta;
};

export type DepartmentOption = {
  _id: string;
  name: string;
  code: string;
};
