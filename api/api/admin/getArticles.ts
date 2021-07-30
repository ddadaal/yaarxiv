import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "../article/models";
import { UserId } from "../auth/models";


export type AdminGetArticlesResult = {
  /** The article id. */
  id: ArticleId;
  /** Thw article owner. */
  owner: {
    /** The owner id. */
    id: UserId;
    /** The owner name. */
    name: string;
  }
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
} & ({ cnTitle: string; } | { enTitle: string })

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
    403: null;
    /** Not login */
    401: null;
  }
}

export const props: ApiProps = {
  summary: "Get all articles on the platform as an admin.",
  requiredRoles: [UserRole.Admin],
};

export const endpoint = {
  url: "/admin/articles",
  method: "GET",
} as Endpoint<AdminGetArticlesSchema>;
