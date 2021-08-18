import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "./models";

export const SCRIPT_FILE_TYPE_HEADER_KEY = "x-yaarxiv-filetype";

/**
 * 200 responses has a header x-yaarxiv-filetype
 * Possble values are ALLOWED_SCRIPT_FORMAT
 */
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
    403: ErrorResponse<"ARTICLE_RETRACTED">;

    404: ErrorResponse<"ARTICLE_NOT_FOUND" | "REVISION_NOT_FOUND">;
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
