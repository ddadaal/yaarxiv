import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { UserId } from "../auth/models";


export interface AdminGetUsersResult {
  /** The user id. */
  id: UserId;
  /** The name of the user. */
  name: string;
  /** The email of the user. */
  email: string;
  /** User role. */
  role: UserRole;
  /** How many articles this user has uploaded. */
  articleCount: number;
}

/** Get all users on the system. */
export interface AdminGetUsersSchema {
  querystring: {
    /**
     * Search word.
     */
    searchWord?: string;
    /**
     * The page number of returned users.
     * @default 1
     */
    page?: number;
  };
  responses: {
    200: {
      /** Paginated users.  */
      users: AdminGetUsersResult[];
      /** Total count of users. */
      totalCount: number;
    };
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  url: "/admin/users",
  method: "GET",
} as Endpoint<AdminGetUsersSchema>;
