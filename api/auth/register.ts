import { ApiProps } from "../utils/apiProps";
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
    /** Registered successfully. */
    201: {
      /** The generated token */
      token: string;
      /** The initial name of the newly-created user. */
      name: string;
      /** User id */
      userId: number;
    },
    /** The email already exists. */
    405: undefined;
  }
}

export const props: ApiProps = {
  summary: "Register.",
};

export const endpoint = {
  url: "/user",
  method: "POST" ,
} as Endpoint<RegisterSchema>;
