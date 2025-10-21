import { User } from "./user/user";
import { UserAuthenticated } from "./user/user";

export type Authentication = {
  user: UserAuthenticated;
  token: string;
  status: number;
};

export type Register = Pick<User, "firstname" | "lastname" | "email"> & {
  password: string;
};

export type Login = Pick<User, "email"> & {
  password: string;
};
