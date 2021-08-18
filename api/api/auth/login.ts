import { ErrorResponse } from "../utils/error";
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
    401: ErrorResponse<"CREDENTIAL_NOT_VALID">;

    /**
     * Login success, but the user is not validated.
     *
     * If user's validation email has been timeout, and
     *   System sends another validation email to the user
     * Else
     *   System will not send validation email
     *
    */
    403: ErrorResponse<"USER_NOT_VALIDATED_EMAIL_SENT" | "USER_NOT_VALIDATED_EMAIL_NOT_SENT">;
  }
}

export const endpoint = {
  url: "/auth",
  method: "GET" ,
} as Endpoint<LoginSchema>;
