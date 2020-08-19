import { ArticleInfo } from "./models";

export const api = {
  url: "/articles",
  method: "GET" ,
} as const;

/** A preview information of the article. */
export interface ArticleSearchResult extends ArticleInfo {

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
export interface Schema {
  querystring: {
    /** The search text */
    searchText?: string;
    /** The start year limit. */
    startYear?: number;
    /** The end year limit. */
    endYear?: number;
    /** The name of authors */
    authorNames?: string[];
    /** Keywords */
    keywords?: string[];
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

// ======= Auto-generated JSON schema begin =======
export const schema = {
  ArticleSearchResult: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the article.",
      },
      authors: {
        type: "array",
        items: {
          $ref: "#/definitions/Author",
        },
        description: "The authors of the article.",
      },
      abstract: {
        type: "string",
        description: "The abstract.",
      },
      keywords: {
        type: "array",
        items: {
          type: "string",
        },
        description: "The keywords of the article.",
      },
      category: {
        type: "string",
        description: "The category of the article.",
      },
      articleId: {
        type: "string",
        description: "The id of the article.",
      },
      commentCount: {
        type: "number",
        description: "The number of comments the article has.",
      },
      createTime: {
        type: "string",
        description: "The time when the article is first uploaded to the platform.\nMust be a valid datetime string.",
      },
      lastUpdateTime: {
        type: "string",
        description: "The time when the article is last updated.\nMust be a valid datetime string.",
      },
    },
    required: [
      "abstract",
      "articleId",
      "authors",
      "category",
      "commentCount",
      "createTime",
      "keywords",
      "lastUpdateTime",
      "title",
    ],
    additionalProperties: false,
    description: "A preview information of the article.",
  },
  ArticleInfo: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the article.",
      },
      authors: {
        type: "array",
        items: {
          $ref: "#/definitions/Author",
        },
        description: "The authors of the article.",
      },
      abstract: {
        type: "string",
        description: "The abstract.",
      },
      keywords: {
        type: "array",
        items: {
          type: "string",
        },
        description: "The keywords of the article.",
      },
      category: {
        type: "string",
        description: "The category of the article.",
      },
    },
    required: [
      "title",
      "authors",
      "abstract",
      "keywords",
      "category",
    ],
    additionalProperties: false,
    description: "The brief info of an revision of an article.",
  },
  Author: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of author.",
      },
      affiliation: {
        type: "string",
        description: "The affiliation of the author",
      },
    },
    required: [
      "name",
    ],
    additionalProperties: false,
    description: "The author information.",
  },
  Schema: {
    type: "object",
    properties: {
      querystring: {
        type: "object",
        properties: {
          searchText: {
            type: "string",
            description: "The search text",
          },
          startYear: {
            type: "number",
            description: "The start year limit.",
          },
          endYear: {
            type: "number",
            description: "The end year limit.",
          },
          authorNames: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The name of authors",
          },
          keywords: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Keywords",
          },
          page: {
            type: "number",
            description: "The page number. 10 results per page.",
            default: 1,
          },
        },
        additionalProperties: false,
      },
      responses: {
        type: "object",
        properties: {
          "200": {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: {
                  $ref: "#/definitions/ArticleSearchResult",
                },
                description: "The paginated results",
              },
              totalCount: {
                type: "number",
                description: "The total count of results.",
              },
            },
            required: [
              "results",
              "totalCount",
            ],
            additionalProperties: false,
            description: "The search is successful.",
          },
        },
        required: [
          "200",
        ],
        additionalProperties: false,
      },
    },
    required: [
      "querystring",
      "responses",
    ],
    additionalProperties: false,
    description: "Search article with optional parameters.",
  },
};
// ======= Auto-generated JSON schema end =======