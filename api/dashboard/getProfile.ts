import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";


/** Get the profile of current logged in user. */
export interface DashboardGetProfileSchema {
  responses: {
    /** Returns the profile of current logged in user. */
    200: {
      /** The name of the user. */
      name: string;
      /** The email of the user. */
      email: string;
      /** The id of the user. */
      userId: number;
    }
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  summary: "Change user profile.",
};

export const endpoint = {
  url: "/dashboard/profile",
  method: "GET",
} as Endpoint<DashboardGetProfileSchema>;
