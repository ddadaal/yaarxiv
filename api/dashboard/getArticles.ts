export const endpoint = {
  url: "/user/articles",
  method: "GET",
} as const;

/** Get the articles this user has. */
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

export const requireAuth = true;

export interface UserGetArticleInfoSchema {
  responses: {
    200: {
      /** The articles the user has. */
      articles: DashboardArticleInfo[];
    }
  }
}
