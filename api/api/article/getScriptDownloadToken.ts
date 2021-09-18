import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";
import { ArticleId } from "./models";

/** Get a token to download article script **/
export interface GetArticleScriptDownloadTokenSchema {
  path: {
    /**
     * The article id
     */
    articleId: ArticleId;
  }
  responses: {
    /** The token will be invalid after 30min */
    200: {
      token: string;
    }

    /**
     * The article has been retracted
     */
    403: ErrorResponse<"ARTICLE_RETRACTED">;

    404: ErrorResponse<"ARTICLE_NOT_FOUND">;
  }
}

export const endpoint = {
  method: "GET",
  url: "/articles/:articleId/scriptDownloadToken",
} as Endpoint<GetArticleScriptDownloadTokenSchema>;
