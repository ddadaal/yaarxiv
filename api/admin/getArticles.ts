import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";


export interface AdminGetArticlesResult {
  /** The article id. */
  id: string;
  /** Thw article owner. */
  owner: {
    /** The owner id. */
    id: string;
    /** The owner name. */
    name: string;
  }
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
  /**
   * Whether the article is public set by the author.
   */
  ownerSetPublicity: boolean;
  /**
   * Whether the article is public set by admin.
   */
  adminSetPublicity: boolean;
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
    },
    /** Not admin. */
    403: {

    },
    /** Not login */
    401: {

    }
  }
}

export const props: ApiProps = {
  summary: "Get all articles on the platform as an admin.",
};

export const endpoint = {
  url: "/admin/articles",
  method: "GET",
} as Endpoint<AdminGetArticlesSchema>;
