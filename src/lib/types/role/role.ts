import { Meta } from "../common";

export type Permission = {
  key: string;
  label: string;
  description: string;
  module: string;
  dangerous?: boolean;
}

export type PermissionGroup = {
  [module: string]: Permission[];
}

export type Role = {
  _id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[]; // Array of permission keys
  isSystemRole: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Omit<Role, "permissions"> {
  permissions: Permission[];
}

export type RoleTable = {
  data: Role[];
  meta: Meta;
}

export type UserPermissions = {
  userId?: string;
  role?: {
    code: string;
    name: string;
    description: string;
  };
  rolePermissions: string[];
  grantedPermissions: string[];
  deniedPermissions: string[];
  effectivePermissions: string[];
  isSuperAdmin?: boolean;
}

export type CreateRolePayload = {
  name: string;
  code: string;
  description: string;
  permissions: string[];
  is_active?: boolean;
}

export interface UpdateRolePayload extends Partial<CreateRolePayload> {}

export type PermissionOverridePayload = {
  permissions: string[];
}
