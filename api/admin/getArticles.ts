export const endpoint = {
  url: "/admin/articles",
  method: "GET",
} as const;

export interface AdminGetArticlesResult {
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

export interface AdminGetArticlesSchema {
  querystring: {
    /** The keyword to search */
    searchWord?: string;
    /**
     * The page number. 10 results per page.
     * @default 1
     * @type {integer}
     */
    page?: number;
  }
  responses: {
    200: {
      /** Paginated articles. */
      articles: AdminGetArticlesResult[];
      /**
       * The total count of articles with specified search keyword.
       * @type {integer}
       */
      totalCount: number;
    }
  }
}
