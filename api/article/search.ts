import { ArticleInfo } from "./models";

export const endpoint = {
  url: "/articles",
  method: "GET" ,
} as const;

/** A preview information of the article. */
export interface ArticleSearchResult extends Omit<ArticleInfo, "pdfLink"> {

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
    /**
     * The start year limit.
     * @type {integer} should be an integer
     */
    startYear?: number;
    /**
     * The end year limit.
     * @type {integer} should be an integer
     */
    endYear?: number;
    /** The name of authors */
    authorNames?: string | string[];
    /**
     * Keywords.
     * Search articles with ALL of specified keywords.
     * Keyword can be incomplete.
     * For example, for keywords ["Computer", "Biology"]:
     *    ["Computer", "Biology", "Chemistry"] Yes
     *    ["Computer Science", "Biology", "Cheistry"] Yes
     *    ["Computer Science", "Physics"] No
     *    ["Computer", "Physics"] No
     */
    keywords?: string | string[];
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
