import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";


/** Change the profile of the current logged in user. */
export interface ChangeProfileSchema {

  body: {
    /** New name */
    name?: string;
    /**
     * New email.
     * @format email
     */
    email?: string;
  };
  responses: {
    /** The profile has been updated. */
    204: undefined;
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  summary: "Change user's profile.",
};

export const endpoint = {
  url: "/dashboard/profile",
  method: "PATCH",
} as Endpoint<ChangeProfileSchema>;
