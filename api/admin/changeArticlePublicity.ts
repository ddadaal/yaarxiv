export const endpoint = {
  method: "PATCH",
  url: "/admin/articles/:articleId/publicity",
} as const;

/** Change the owner set publicity of an article. */
export interface ChangeArticleAdminSetPublicitySchema {
  path: {
    /** The id of the article. */
    articleId: string;
  };
  body: {
    /** Whether the article is public. */
    public: boolean;
  }
  responses: {
    /**
     * The publicity has been successfully changed.
     * Returns the new publicity.
     */
    200: {
      /** The new publicity. */
      public: boolean;
    };
    /** The article is not found. */
    404: {};
    /** Only admin can change the admin set publicity of an article. */
    403: {};
  }
}
