import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "../article/models";
import { ArticleNotFoundResponse, ErrorResponse } from "../utils/error";

/** Change the owner set publicity of an article. */
export interface ChangeArticleOwnerSetPublicitySchema {
  path: {
    /** The id of the article. */
    articleId: ArticleId;
  };
  body: {
    /** Whether the article is public. */
    publicity: boolean;
  }
  responses: {
    /**
     * The publicity has been successfully changed.
     * Returns the new publicity.
     */
    200: {
      /** The new publicity. */
      publicity: boolean;
    };

    /** The article is not found. */
    404: ArticleNotFoundResponse;

    /** Only the owner can change the owner set publicity of an article. */
    403: ErrorResponse<"NOT_OWNER">;
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.User],
};

export const endpoint = {
  method: "PATCH",
  url: "/user/articles/:articleId/publicity",
} as Endpoint<ChangeArticleOwnerSetPublicitySchema>;
