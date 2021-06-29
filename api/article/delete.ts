import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";

/**
 * Delete an article and all of its revisions.
 * Only the owner and admin can do it.
 */
export interface DeleteArticleSchema {
  path: {
    /** The ID of the article to be deleted. */
    articleId: number;
  },
  responses: {
    /** The article and all is deleted. */
    200: {

    },
    /** The article is not found. */
    404: {

    },
    /** The user cannot delete the article. */
    403: {

    }
  }
}

export const props: ApiProps = {
  summary: "Delete an article from the platform.",
};

export const endpoint = {
  url: "/articles/:articleId",
  method: "DELETE",
} as Endpoint<DeleteArticleSchema>;
