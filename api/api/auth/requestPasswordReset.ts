import { UserNotFoundResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";

/** Request to reset a password. */
export interface RequestPasswordResetSchema {
  body: {
    /** Account email. */
    email: string;
  };
  responses: {
    /** Email reset mail has been sent. */
    204: null;

    /** User does not exist. */
    404: UserNotFoundResponse;
  }
}

export const endpoint = {
  url: "/auth/forget",
  method: "POST",
} as Endpoint<RequestPasswordResetSchema>;
