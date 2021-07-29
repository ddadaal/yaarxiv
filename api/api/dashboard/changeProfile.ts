import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { Profile } from "./model";


/** Change the profile of the current logged in user. */
export interface ChangeProfileSchema {
  body: {
    profileChange: Partial<Profile>;
  };
  responses: {
    /** The profile has been updated. */
    204: null;
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
