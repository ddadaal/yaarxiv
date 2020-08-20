import { Article as getWithRevision } from "./models";

export const endpoint = {
  url: "/articles/:articleId/revisions/:revision",
  method: "GET" ,
} as const;

/** Get the full information of an article. */
export interface GetArticleWithIdAndRevisionSchema {
  path: {
    /** articleId */
    articleId: string;
    /**
     * revision number.
     * Must be an non-negative integer.
     * If 0 is given, the latest revision will be returned.
     */
    revision: number;
  },
  responses: {
    /** Returns the specified revision of an article. */
    200: {
      /** The article information. */
      article: getWithRevision;
    },
    /** The article or the revision is not found. */
    404: {

    }
  }
}
