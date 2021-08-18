import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { ArticleNotFoundResponse } from "../utils/error";
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

    404: ArticleNotFoundResponse;
  }
}

export const props: ApiProps = {
  summary: "Delete an article from the platform.",
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  url: "/articles/:articleId",
  method: "DELETE",
} as Endpoint<DeleteArticleSchema>;
