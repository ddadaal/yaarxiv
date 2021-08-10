import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "./models";

export interface GetArticleFileSchema {
  path: {
    /**
     * The article id
     */
    articleId: ArticleId;
  }
  querystring: {

    /**
     * The number of revision.
     * If not set, return the latest revision
     */
    revision?: number;
  }
  responses: {
    200: any;

    /**
     * The article has been retracted
     */
    403: null;

    404: {
      notFound: "article" | "revision";
    }
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.User, UserRole.Admin],
  consumes: ["application/octet-stream"],
};

export const endpoint = {
  method: "GET",
  url: "/articles/:articleId/file",
} as Endpoint<GetArticleFileSchema>;
