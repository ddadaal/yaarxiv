import { Article } from "./models";

export const endpoint = {
  url: "/articles/:articleId/revisions/:revision",
  method: "GET" ,
} as const;

/** Get the full information of an article. */
export interface GetArticleWithIdAndRevisionSchema {
  path: {
    /** articleId */
    articleId: string;
    /** revision number */
    revision: string;
  },
  responses: {
    /** Returns the specified revision of an article. */
    200: {
      /** The article information. */
      article: Article;
    },
    /** The article or the revision is not found. */
    404: {

    }
  }
}
