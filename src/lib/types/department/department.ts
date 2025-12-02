import { Meta } from "../common";

export type Department = {
  _id: string;
  name: string;
  description?: string;
  code: string;
  parentId?: string | null;
  parent?: Department | null;
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
