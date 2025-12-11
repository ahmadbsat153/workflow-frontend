import { Meta } from "../common";
import { Department } from "../department/department";
import { Position } from "../position/position";
import { Branch } from "../branch/branch";
import { Role } from "../role/role";

// Lightweight role reference returned by API
export type RoleReference = {
  id: string;
  code: string;
  name: string;
};

export type User = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country_code: string;
  confirmation_code: string;
  is_archived: boolean;
  is_active: boolean;
  is_super_admin: boolean;
  provider: string;
  authentication: {
    password: string;
    recovery_token: string;
    recovery_sent_at: string;
  };
  customPermissions?: {
    granted: string[];
    denied: string[];
  };
  // Organizational fields
  role: RoleReference; // Changed from full Role to lightweight reference
  departmentId?: Department | null;
  positionId?: Position | null;
  branchId?: Branch | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserAuthenticated = Omit<
  User,
  | "confirmation_code"
  | "banned_until"
  | "is_archived"
  | "is_active"
  | "last_sign_in_at"
  | "provider"
  | "authentication"
>;

export type UserForm = Omit<
  User,
  | "createdAt"
  | "updatedAt"
  | "__v"
  | "_id"
  | "confirmation_code"
  | "banned_until"
  | "is_archived"
  | "last_sign_in_at"
  | "provider"
  | "authentication"
> & { password: string };

export type UserTable = { data: User[]; meta: Meta };
