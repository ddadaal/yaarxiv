import { Endpoint } from "../utils/schema";

/** Change the owner set publicity of an article. */
export interface ChangeArticleAdminSetPublicitySchema {
  body: {
    /** The id of the article. */
    articleId: string;
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
    404: {};
    /** Only admin can change the admin set publicity of an article. */
    403: {};
  }
}

export const endpoint = {
  method: "PATCH",
  url: "/admin/articles/publicity",
} as Endpoint<ChangeArticleAdminSetPublicitySchema>;
