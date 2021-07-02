import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "../article/models";

/** Change the owner set publicity of an article. */
export interface ChangeArticleAdminSetPublicitySchema {
  path: {
    /** The id of the article. */
    articleId: ArticleId;
  };
  body: {
    /** Whether the article is public. */
    publicity: boolean;
  };
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
    404: null;
    /** Only admin can change the admin set publicity of an article. */
    403: null;
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  method: "PATCH",
  url: "/admin/articles/:articleId/publicity",
} as Endpoint<ChangeArticleAdminSetPublicitySchema>;
