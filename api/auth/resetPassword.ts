import { Endpoint } from "../utils/schema";

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
    403: {};
    /** Password is reset. */
    201: {};
  }
}

export const endpoint = {
  url: "/auth/forget/reset",
  method: "POST",
} as Endpoint<ResetPasswordSchema>;
