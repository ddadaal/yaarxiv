import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";


/** Change the account info of the current logged in user. */
export interface ChangeAccountInfoSchema {

  body: {
    /** New name */
    name?: string;
  };
  responses: {
    /** The profile has been updated. */
    204: null;
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  summary: "Change user's account info.",
};

export const endpoint = {
  url: "/dashboard/account",
  method: "PATCH",
} as Endpoint<ChangeAccountInfoSchema>;
