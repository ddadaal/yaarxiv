import { Endpoint } from "../utils/schema";
import { Article } from "./models";


/** Get the full information of an article. */
export interface GetArticleSchema {
  path: {
    /** Article ID. */
    articleId: string;
  },
  querystring: {
    /**
     * Revision nunber.
     * If not set, the latest revision will be returned.
     */
    revision?: number;
  }
  responses: {
    /** Returns the latest revision of an article. */
    200: {
      /** The article information. */
      article: Article;
    },
    /** The article or specified revision is not found. */
    404: {
      notFound: "article" | "revision";
    }
  }
}


export const endpoint = {
  url: "/articles/:articleId",
  method: "GET" ,
} as Endpoint<GetArticleSchema>;
