import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";

/**
 * Delete a user and all of related articles.
 * Only admin can do it.
 */
export interface AdminDeleteArticleSchema {
  path: {
    /** The ID of the user to be deleted. */
    userId: number;
  },
  responses: {
    /** The user and all related is deleted. */
    204: undefined;

    /** The user is not found. */
    404: {

    },
  }
}

export const props: ApiProps = {
  summary: "Delete an user from the platform.",
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  url: "/admin/users/:userId",
  method: "DELETE",
} as Endpoint<AdminDeleteArticleSchema>;
