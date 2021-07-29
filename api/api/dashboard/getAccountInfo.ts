import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { UserId } from "../auth/models";


/** Get the profile of current logged in user. */
export interface GetAccountInfoSchema {
  responses: {
    /** Returns the profile of current logged in user. */
    200: {
      /** The name of the user. */
      name: string;
      /** The email of the user. */
      email: string;
      /** The id of the user. */
      userId: UserId;
    }
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  summary: "Change user profile.",
};

export const endpoint = {
  url: "/dashboard/account",
  method: "GET",
} as Endpoint<GetAccountInfoSchema>;
