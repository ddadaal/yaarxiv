import { Article } from "./models";

export const endpoint = {
  url: "/articles/:articleId",
  method: "GET" ,
} as const;

/** Get the full information of an article. */
export interface GetArticleWithIdSchema {
  path: {
    /** articleId */
    articleId: string;
  },
  responses: {
    /** Returns the latest revision of an article. */
    200: {
      /** The article information. */
      article: Article;
    },
    /** The article is not found. */
    404: {

    }
  }
}


