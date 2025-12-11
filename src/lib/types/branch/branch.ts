import { Meta } from "../common";
import { Department } from "../department/department";

export type Branch = {
  _id: string;
  name: string;
  code: string;
  description: string;
  departmentId?: string | null;
  department?: Department | null;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  managerId?: string | null;
  contactInfo: {
    phone: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BranchTable = {
  data: Branch[];
  meta: Meta;
};

export type BranchOption = {
  _id: string;
  name: string;
  code: string;
};
