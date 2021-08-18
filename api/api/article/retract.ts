import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { ArticleNotFoundResponse, ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "./models";

/**
 * Delete an article and all of its revisions.
 * Only the owner and admin can do it.
 */
export interface RetractArticleSchema {
  path: {
    /** The ID of the article to be deleted. */
    articleId: ArticleId;
  },
  body: {},
  responses: {
    /** The article has been retracted */
    204: null;

    /** The article is not found. */
    404: ArticleNotFoundResponse;

    /**
     * retracted: the article has already been retracted
     * noAccess: only the author and admin can retract the article
     */
    403: ErrorResponse<"ARTICLE_RETRACTED" | "NOT_AUTHOR_OR_ADMIN">;
  }
}

export const props: ApiProps = {
  summary: "Retract an article.",
  requiredRoles: [UserRole.Admin, UserRole.User],
};

export const endpoint = {
  url: "/articles/:articleId/retraction",
  method: "POST",
} as Endpoint<RetractArticleSchema>;
