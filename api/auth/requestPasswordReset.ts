import { Endpoint } from "../utils/schema";

/** Request to reset a password. */
export interface RequestPasswordResetSchema {
  body: {
    /** Account email. */
    email: string;
  };
  responses: {
    /** Email reset mail has been sent. */
    201: null;
    /** Account does not exist. */
    404: null;
  }
}

export const endpoint = {
  url: "/auth/forget",
  method: "POST",
} as Endpoint<RequestPasswordResetSchema>;
