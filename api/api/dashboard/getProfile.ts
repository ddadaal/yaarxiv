import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { Profile } from "./model";


/** Get the profile of current logged in user. */
export interface GetProfileSchema {
  responses: {
    /** Returns the profile of current logged in user. */
    200: Profile;
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  summary: "Get User Profile",
};

export const endpoint = {
  url: "/dashboard/profile",
  method: "GET",
} as Endpoint<GetProfileSchema>;
