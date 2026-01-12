import { User } from "./user/user";

export type Profile = User & {
  permissions: {
    granted: string[];
    denied: string[];
    effective: string[];
  };
  authentication: {
    provider: string;
    provider_id: string;
  };
};

export type ProfileUpdateData = {
  firstname: string;
  lastname?: string;
  phone?: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ProfileStatistics = {
  userId: string;
  email: string;
  accountCreated: string;
  lastLogin: string;
};
