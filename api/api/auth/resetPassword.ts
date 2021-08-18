import { ErrorResponse } from "../utils/error";
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
    /** Password is reset. */
    201: null;
    /** The reset password token is invalid. */
    403: ErrorResponse<"TOKEN_NOT_VALID">;
  }
}

export const endpoint = {
  url: "/auth/forget/reset",
  method: "POST",
} as Endpoint<ResetPasswordSchema>;
