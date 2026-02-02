import { Meta } from "../common";

export type Branch = {
  _id: string;
  name: string;
  code: string;
  description: string;
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
