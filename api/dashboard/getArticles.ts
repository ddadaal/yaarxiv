export const endpoint = {
  url: "/user/articles",
  method: "GET",
} as const;

export const summary = "Get the articles this user is the owner of.";

/** Get the articles this user is the owner of. */
export interface DashboardArticleInfo {
  /** The article id. */
  id: string;
  /** The article title of the latest revision. */
  title: string;
  /** The time the article is first created. */
  createTime: string;
  /** Last updated time */
  lastUpdatedTime: string;
  /**
   * The number of revisions this article has.
   * @type {integer}
   */
  revisionCount: number;
}

export interface UserGetArticleInfoSchema {
  querystring: {
    /**
     * The page number. 10 results per page.
     * @default 1
     * @type {integer}
     */
    page?: number;
  },
  responses: {
    200: {
      /** The articles the user has. */
      articles: DashboardArticleInfo[];
      /**
       * The total count of articles.
       * @type {integer}
       */
      totalCount: number;
    },
    /** The request is not authenticated. */
    401: {

    }
  }
}
