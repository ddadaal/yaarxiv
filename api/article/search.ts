export const api = {
  url: "/articles",
  method: "GET" ,
} as const;

/** The author information. */
export interface Author {
  /** The name of author. */
  name: string;
  /** The affiliation of the author */
  affiliation?: string;
}

/** A preview information of the article. */
export interface ArticlePreview {
  /** The id of the article in yaarxiv database. */
  id: string;
  /** The title of the article. */
  title: string;
  /** The authors of the article. */
  authors: Author[];
  /** The abstract. Might be trimmed. */
  abstract: string;
  /** The keywords of the article. */
  keywords: string[];
  /** The category of the article. */
  category: string;
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
    authors?: string[];
    /**
     * The page size.
     * @default 10
     * @type {integer}
     */
    pageSize?: number;
    /**
     * The page number.
     * @default 1
     * @type {integer}
     */
    pageNumber?: number;
  };
  responses: {
    /** The search is successful. */
    200: {
      /** The paginated results */
      results: ArticlePreview[];
      /** The total count of results. */
      totalCount: number;
    },
  }
}

// ======= Auto-generated JSON schema begin =======
export const schema = {
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
  ArticlePreview: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The id of the article in yaarxiv database.",
      },
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
        description: "The abstract. Might be trimmed.",
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
      "id",
      "title",
      "authors",
      "abstract",
      "keywords",
      "category",
      "commentCount",
      "createTime",
      "lastUpdateTime",
    ],
    additionalProperties: false,
    description: "A preview information of the article.",
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
          authors: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The name of authors",
          },
          pageSize: {
            type: "number",
            description: "The page size.",
            default: 10,
          },
          pageNumber: {
            type: "number",
            description: "The page number.",
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
                  $ref: "#/definitions/ArticlePreview",
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