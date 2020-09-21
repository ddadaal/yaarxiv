export const endpoint = {
  url: "/admin/users/:userId",
  method: "DELETE",
} as const;

export const summary = "Delete an user from the platform.";

/**
 * Delete a user and all of related articles.
 * Only admin can do it.
 */
export interface AdminDeleteArticleSchema {
  path: {
    /** The ID of the user to be deleted. */
    userId: string;
  },
  responses: {
    /** The user and all related is deleted. */
    200: {

    },
    /** The article is not found. */
    404: {

    },
    /** The user cannot delete the article. */
    403: {

    };
    /** Not login */
    401: {

    }
  }
}
