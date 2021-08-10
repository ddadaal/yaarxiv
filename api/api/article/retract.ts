import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
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
  responses: {
    /** The article ihas been retracted */
    204: null;
    /** The article is not found. */
    404: null;

    /**
     * retracted: the article has already been retracted
     * noAccess: only the author and admin can retract the article
     */
    403: {
      reason: "retracted" | "noAccess";
    };
  }
}

export const props: ApiProps = {
  summary: "Retract an article.",
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  url: "/articles/:articleId/retraction",
  method: "POST",
} as Endpoint<RetractArticleSchema>;
