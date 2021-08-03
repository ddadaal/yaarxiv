import { UserId } from "../auth/models";

export type UploadedFileId = number;

/** The author information. */
export interface Author {
  /** The name of author. */
  name: string;
  /** The affiliation of the author */
  affiliation?: string;
}

export const TITLE_MAX_LENGTH = 100;

export type ArticleInfo = {

  /** The authors of the article. */
  authors: Author[];

  /**
   * The abstract.
   */
  abstract: string;

  /**
   * Link to code.
   * Should pass validation from utils/codeLink.ts
   * @format uri
   */
  codeLink?: string;

  /**
   * Chinese Title
   * @maxLength 100
   */
  cnTitle?: string;

  /**
   * Chinese Keywords
   */
  cnKeywords?: string[];

  /**
   * English Title
   * @maxLength 100
   */
  enTitle?: string;

  /**
   * Chinese Keywords
   */
  enKeywords?: string[];

};

export interface ArticleRevision {
  /** The number of the revision starting from 1. */
  number: number;
  /**
   * Upload time.
   * Must be a valid ISO string with timezone.
   */
  time: string;
}

export type ArticleId = number;

/** The full article info. */
export interface Article {
  /** The id of the article. */
  id: ArticleId;
  /**
   * Current revision number.
   * Must be a integer.
   */
  revisionNumber: number;
  /** The current revision. */
  currentRevision: ArticleInfo;
  /** All revisions */
  revisions: ArticleRevision[];
  /** Owner User Id */
  ownerId: UserId;
  /**
   * The time when the article is first uploaded to the platform.
   * Must be a valid datetime string.
   */
  createTime: string;
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
