import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "./models";

/**
 * Delete an article and all of its revisions.
 * Only the owner and admin can do it.
 */
export interface DeleteArticleSchema {
  path: {
    /** The ID of the article to be deleted. */
    articleId: ArticleId;
  },
  responses: {
    /** The article and all is deleted. */
    204: null;
    /** The article is not found. */
    404: null;
    /** The user cannot delete the article. */
    403: null;
  }
}

export const props: ApiProps = {
  summary: "Delete an article from the platform.",
  requiredRoles: [UserRole.Admin, UserRole.User],
};

export const endpoint = {
  url: "/articles/:articleId",
  method: "DELETE",
} as Endpoint<DeleteArticleSchema>;
