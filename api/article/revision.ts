import { Article } from "./models";

export const api = {
  url: "/articles/:articleId/revisions/:revision",
  method: "GET" ,
} as const;

/** Get the full information of an article. */
export interface Schema {
  path: {
    /** articleId */
    articleId: string;
    /** revision number */
    revision: string;
  },
  responses: {
    /** Returns the specified revision of an article. */
    200: {
      /** The article information. */
      article: Article;
    },
    /** The article or the revision is not found. */
    404: {

    }
  }
}


// ======= Auto-generated JSON schema begin =======
export const schema = {
  Schema: {
    type: "object",
    properties: {
      path: {
        type: "object",
        properties: {
          articleId: {
            type: "string",
            description: "articleId",
          },
          revision: {
            type: "string",
            description: "revision number",
          },
        },
        required: [
          "articleId",
          "revision",
        ],
        additionalProperties: false,
      },
      responses: {
        type: "object",
        properties: {
          "200": {
            type: "object",
            properties: {
              article: {
                $ref: "#/definitions/Article",
                description: "The article information.",
              },
            },
            required: [
              "article",
            ],
            additionalProperties: false,
            description: "Returns the specified revision of an article.",
          },
          "404": {
            type: "object",
            additionalProperties: false,
            description: "The article or the revision is not found.",
          },
        },
        required: [
          "200",
          "404",
        ],
        additionalProperties: false,
      },
    },
    required: [
      "path",
      "responses",
    ],
    additionalProperties: false,
    description: "Get the full information of an article.",
  },
  Article: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The id of the article.",
      },
      revisionNumber: {
        type: "number",
        description: "Current revision number.\r\nMust be a integer.",
      },
      currentRevision: {
        $ref: "#/definitions/ArticleInfo",
        description: "The current revision.",
      },
      revisions: {
        type: "array",
        items: {
          $ref: "#/definitions/ArticleRevision",
        },
        description: "All revisions",
      },
    },
    required: [
      "id",
      "revisionNumber",
      "currentRevision",
      "revisions",
    ],
    additionalProperties: false,
    description: "The full article info.",
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
  ArticleRevision: {
    type: "object",
    properties: {
      number: {
        type: "number",
        description: "The number of the revision starting from 1.",
      },
      time: {
        type: "string",
        description: "Upload time.\r\nMust be a valid ISO string with timezone.",
      },
    },
    required: [
      "number",
      "time",
    ],
    additionalProperties: false,
  },
};
// ======= Auto-generated JSON schema end =======