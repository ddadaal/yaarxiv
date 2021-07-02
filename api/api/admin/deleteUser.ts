import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { UserId } from "../auth/models";

/**
 * Delete a user and all of related articles.
 * Only admin can do it.
 */
export interface AdminDeleteUserSchema {
  path: {
    /** The ID of the user to be deleted. */
    userId: UserId;
  },
  responses: {
    /** The user and all related is deleted. */
    204: null;

    /** The user is not found. */
    404: null;
  }
}

export const props: ApiProps = {
  summary: "Delete an user from the platform.",
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  url: "/admin/users/:userId",
  method: "DELETE",
} as Endpoint<AdminDeleteUserSchema>;
