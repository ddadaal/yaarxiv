import { ApiProps } from "../utils/apiProps";
import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";

/** Register */
export interface RegisterSchema {
  body: {
    /**
     * The email.
     * Requires to be an edu email.
     * @format email
     */
    email: string;
    /** The password */
    password: string;
  };
  responses: {
    /** Register completed. */
    201: {},
    /** The email already exists. */
    405: ErrorResponse<"EMAIL_ALREADY_EXISTS">;
  }
}

export const props: ApiProps = {
  summary: "Register an account",
};

export const endpoint = {
  url: "/user",
  method: "POST" ,
} as Endpoint<RegisterSchema>;
