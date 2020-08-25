export const endpoint = {
  url: "/articles/:articleId",
  method: "DELETE",
} as const;

/** Delete an article and all of its revisions. */
export interface DeleteArticleSchema {
  path: {
    /** The ID of the article to be deleted. */
    articleId: string;
  },
  responses: {
    /** The article and all is deleted. */
    200: {

    }
  }
}
