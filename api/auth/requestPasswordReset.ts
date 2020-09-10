export const endpoint = {
  url: "/auth/forget",
  method: "POST",
} as const;

/** Request to reset a password. */
export interface RequestPasswordResetSchema {
  body: {
    /** Account email. */
    email: string;
  };
  responses: {
    /** Email reset mail has been sent. */
    201: {

    }
    /** Account does not exist. */
    404: {

    }
  }
}
