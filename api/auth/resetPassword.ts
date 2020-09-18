export const endpoint = {
  url: "/auth/forget/reset",
  method: "POST",
} as const;

/** Reset password with a password reset token. */
export interface ResetPasswordSchema {
  body: {
    /** The reset password request token. */
    token: string;
    /** New password */
    newPassword: string;
  };
  /**  */
  responses: {
    /** The reset password token is invalid. */
    403: {
      /**
       * The reason why the token is not valid.
       */
      reason: "token-timeout" | "user-not-exists" | "token-not-exists";
    };
    /** Password is reset. */
    201: {};
  }
}
