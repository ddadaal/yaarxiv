import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";


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
    204: null;
    /** The current password is not correct. */
    403: null
  }
}

export const props: ApiProps = {
  summary:  "Change user's password.",
  requiredRoles: [UserRole.Admin, UserRole.User],
};

export const endpoint = {
  url: "/user/password",
  method: "PATCH",
} as Endpoint<ChangePasswordSchema>;
