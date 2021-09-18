import { ApiProps as getArticleScript } from "../utils/apiProps";
import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "./models";

/** Get the script file of the article. */
export interface GetArticleScriptSchema {
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

    /**
     * The download token get by getScriptDownloadTokena api
     */
    token: string;
  }
  responses: {
    200: any;

    /**
     * The token is not valid
     * The article has been retracted
     */
    403: ErrorResponse<"TOKEN_INVALID" | "ARTICLE_RETRACTED">;

    404: ErrorResponse<"ARTICLE_NOT_FOUND" | "REVISION_NOT_FOUND">;
  }
}

export const props: getArticleScript = {
  consumes: ["application/octet-stream"],
};

export const endpoint = {
  method: "GET",
  url: "/articles/:articleId/script",
} as Endpoint<GetArticleScriptSchema>;
