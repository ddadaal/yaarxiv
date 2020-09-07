export const endpoint = {
  url: "/dashboard/profile/password",
  method: "PATCH",
} as const;

export const summary = "Change user's password.";

/** Change the password of the current logged in user. */
export interface ChangePasswordSchema {

  body: {
    /** Current password. */
    current: string;
    /** The new password. */
    changed: string;
  };
  responses: {
    /** The password has been changed. */
    200: {
    };
    /** The current password is not correct. */
    403: {

    }
  }
}
