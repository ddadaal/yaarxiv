import { ApiProps } from "../utils/apiProps";
import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";

/** Validate a email with a token. */
export interface ValidateEmailSchema {
  body: {
    token: string;
  };
  responses: {
    /** Email has been validated. */
    201: {};
    /** Token is not valid. */
    403: ErrorResponse<"TOKEN_NOT_VALID">;
  }
}

export const props: ApiProps = {
};

export const endpoint = {
  method: "POST",
  url: "/user/emailValidation",
} as Endpoint<ValidateEmailSchema>;
