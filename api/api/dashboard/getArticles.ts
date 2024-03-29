import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { ArticleId, ArticleInfoI18nPart } from "../article/models";


/** Get the articles this user is the owner of. */
export type DashboardArticleInfo = {
  /** The article id. */
  id: ArticleId;

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

  /**
   * the time the article is retracted, if retracted
   * @format date-time
    */
  retractTime?: string;

} & ArticleInfoI18nPart;

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
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  summary: "Get the articles this user is the owner of.",
};

export const endpoint = {
  url: "/user/articles",
  method: "GET",
} as Endpoint<UserGetArticleInfoSchema>;
