import { ArticleRevision } from "../../../src/entities/ArticleRevision";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { Author } from "yaarxiv-api/article/models";
import { normalUser1, normalUser2 } from "./login";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { generatePdf } from "./data";

const articleTime = new Date();

const authors: Author[] = [
  { name: "CJD", affiliation: "NJU" },
  { name: "CJY" },
];

export const commonKeyword = "commonKeyword";

const genRevision = (article: Article, revisionId: number, pdf: PdfUpload) => {
  const rev = new ArticleRevision();
  rev.title = `Article ${article.id} Revision ${revisionId}`;
  rev.revisionNumber = revisionId + 1;
  rev.authors = authors;
  rev.abstract = rev.title + " Abstract";
  rev.time = articleTime;
  rev.pdf = pdf;
  rev.category = rev.title + "Category";
  rev.keywords = [commonKeyword, article.id+""];
  return rev;
};

export const generateArticle = (id: number) => {
  const article = new Article();
  article.id = id;
  article.revisions = range(0,id+1).map((i) => genRevision(article, i, generatePdf()));
  article.createTime = new Date(articleTime);
  article.createTime.setFullYear(2000 + id);
  article.lastUpdateTime = articleTime;
  article.latestRevisionNumber = id+1;
  article.owner = id % 2 == 1 ? normalUser1 : normalUser2;
  return article;
};
