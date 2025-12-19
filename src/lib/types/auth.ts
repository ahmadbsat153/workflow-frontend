import { User } from "./user/user";
import { UserAuthenticated } from "./user/user";

export type Authentication = {
  user: UserAuthenticated;
  token: string;
  permissions: string[];
  status: number;
};

export type InvitedUser = {
  firstname: string;
  lastname: string;
  email: string;
  roleCode: string | null | undefined;
  departmentId: string | null | undefined;
  branchId: string | null | undefined;
  positionId: string | null | undefined;
};

export type AcceptInvitation = {
  token: string;
  password: string;
};

export type ValidateInvitationToken = {
  token: string;
};

export type InvitationValidationResponse = {
  valid: boolean;
  data?: {
    email: string;
    firstname: string;
    lastname: string;
  };
};

export type Register = Pick<User, "firstname" | "lastname" | "email"> & {
  password: string;
};

export type Login = Pick<User, "email"> & {
  password: string;
};
