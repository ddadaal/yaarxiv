/**
 * The response for all non-200 errors
 * This structure aligns with fastify errors
 *
 * TCode is only for documentation.
 */
export interface ErrorResponse<TCode extends string> {
  code: TCode;
  message?: string;
}

export type UserNotFoundResponse = ErrorResponse<"USER_NOT_FOUND">;
export type ArticleNotFoundResponse = ErrorResponse<"ARTICLE_NOT_FOUND">;
