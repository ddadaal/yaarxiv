import { ArticleInfo } from "./models";

export const endpoint = {
  url: "/articles",
  method: "GET" ,
} as const;

/** A preview information of the article. */
export interface ArticleSearchResult extends ArticleInfo {

  /** The id of the article. */
  articleId: string;

  /** The number of comments the article has. */
  commentCount: number;
  /**
   * The time when the article is first uploaded to the platform.
   * Must be a valid datetime string.
   */
  createTime: string;
  /**
   * The time when the article is last updated.
   * Must be a valid datetime string.
   */
  lastUpdateTime: string;
}

export const summary = "Search article.";

/**
 * Search article with optional parameters.
 * */
export interface SearchArticleSchema {
  querystring: {
    /** The search text */
    searchText?: string;
    /** The start year limit. */
    startYear?: number;
    /** The end year limit. */
    endYear?: number;
    /** The name of authors */
    authorNames?: string[];
    /** Keywords */
    keywords?: string[];
    /**
     * The page number. 10 results per page.
     * @default 1
     * @type {integer}
     */
    page?: number;
  };
  responses: {
    /** The search is successful. */
    200: {
      /** The paginated results */
      results: ArticleSearchResult[];
      /** The total count of results. */
      totalCount: number;
    },
  }
}
