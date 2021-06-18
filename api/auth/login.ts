import { Endpoint } from "../utils/schema";

export const summary = "Login using id and password";

export enum UserRole {
  User = "User",
  Admin = "Admin",
}

/** Login */
export interface LoginSchema {
  querystring: {
    /** The login id, for example email */
    id: string;
    /** The password */
    password: string;
  };
  responses: {
    /** Logged in successfully. Returns user info. */
    200: {
      /** The generated token */
      token: string;
      /** The name of the user */
      name: string;
      /** The role of the user. */
      role: UserRole;
      /** User id */
      userId: string;
    },
    /** Login failed. The username and password are not valid. */
    401: {
    }
  }
}

export const endpoint = {
  url: "/user/auth",
  method: "GET" ,
} as Endpoint<LoginSchema>;
