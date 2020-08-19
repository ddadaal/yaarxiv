/** The author information. */
export interface Author {
  /** The name of author. */
  name: string;
  /** The affiliation of the author */
  affiliation?: string;
}

/** The brief info of an revision of an article. */
export interface ArticleInfo {
  /** The title of the article. */
  title: string;
  /** The authors of the article. */
  authors: Author[];
  /** The abstract. */
  abstract: string;
  /** The keywords of the article. */
  keywords: string[];
  /** The category of the article. */
  category: string;
}

export interface ArticleRevision {
  /** The number of the revision starting from 1. */
  number: number;
  /**
   * Upload time.
   * Must be a valid ISO string with timezone.
   */
  time: string;
}

/** The full article info. */
export interface Article {
  /** The id of the article. */
  id: string;
  /**
   * Current revision number.
   * Must be a integer.
   */
  revisionNumber: number;
  /** The current revision. */
  currentRevision: ArticleInfo;
  /** All revisions */
  revisions: ArticleRevision[];
}

/** The comment to an article. */
export interface ArticleComment {
  /** The comment id. */
  id: string;
  /** The article id. */
  articleId: string;
  /**
   * Revision the comment is targeting.
   * If undefined, the comment is targeting the article itself.
   * */
  revisionNumber?: number;
  /** User */
  userId: string;
  /** The time the comment is first created.*/
  createTime: string;
  /** The time the comment is last updated. */
  lastUpdatedTime: string;
  /** Content */
  content: string;
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
  ArticleRevision: {
    type: "object",
    properties: {
      number: {
        type: "number",
        description: "The number of the revision starting from 1.",
      },
      time: {
        type: "string",
        description: "Upload time.\nMust be a valid ISO string with timezone.",
      },
    },
    required: [
      "number",
      "time",
    ],
    additionalProperties: false,
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
        description: "Current revision number.\nMust be a integer.",
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
  ArticleComment: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The comment id.",
      },
      articleId: {
        type: "string",
        description: "The article id.",
      },
      revisionNumber: {
        type: "number",
        description: "Revision the comment is targeting.\nIf undefined, the comment is targeting the article itself.",
      },
      userId: {
        type: "string",
        description: "User",
      },
      createTime: {
        type: "string",
        description: "The time the comment is first created.",
      },
      lastUpdatedTime: {
        type: "string",
        description: "The time the comment is last updated.",
      },
      content: {
        type: "string",
        description: "Content",
      },
    },
    required: [
      "id",
      "articleId",
      "userId",
      "createTime",
      "lastUpdatedTime",
      "content",
    ],
    additionalProperties: false,
    description: "The comment to an article.",
  },
};
// ======= Auto-generated JSON schema end =======