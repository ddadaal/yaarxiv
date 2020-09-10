export const endpoint = {
  url: "/auth/forget/validate",
  method: "GET",
} as const;

/** Validate a token (a link) for password reset. */
export interface ValidatePasswordResetTokenSchema {
  querystring: {
    /** The token of password reset. */
    token: string;
  };
  responses: {
    200: {
      /** Whether the token is valid. */
      valid: boolean;
    };
  }
}
