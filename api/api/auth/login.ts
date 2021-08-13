import { Endpoint } from "../utils/schema";
import { UserId } from "./models";

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
      userId: UserId;
    },
    /** Login failed. The username and password are not valid. */
    401: null;

    /**
     * Login success, but the user is not validated.
     *
     * If user's validation email has been timeout, and
     *   System sends another validation email to the user
     * Else
     *   System will not send validation email
     *
    */
    403: {
      emailSent: boolean;
    };
  }
}

export const endpoint = {
  url: "/auth",
  method: "GET" ,
} as Endpoint<LoginSchema>;
