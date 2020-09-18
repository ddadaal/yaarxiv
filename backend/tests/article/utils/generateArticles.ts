import { ArticleRevision } from "../../../src/entities/ArticleRevision";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { Author } from "yaarxiv-api/article/models";
import { normalUser1, normalUser2 } from "./login";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { generatePdf } from "./data";
import { EntityManager } from "@mikro-orm/core";
import { User } from "@/entities/User";

const articleTime = new Date();

const authors: Author[][] = [
  [{ name: "CJD", affiliation: "NJU" }, { name: "CX", affiliation: "NJU" }, { name: "CST", affiliation: "NJU" }],
  [{ name: "CJY" }, { name: "CJD", affiliation: "NJU" }],
];

export const commonKeyword = "commonKeyword";

const genRevision = (article: Article, revisionNumber: number, pdf: PdfUpload) => {
  const rev = new ArticleRevision();
  rev.title = `Article ${article.id} Revision ${revisionNumber}`;
  rev.revisionNumber = revisionNumber;
  rev.authors = authors[revisionNumber % 2];
  rev.abstract = rev.title + " Abstract";
  rev.time = articleTime;
  rev.pdf = pdf;
  rev.category = rev.title + "Category";
  rev.keywords = [commonKeyword, article.id+""];
  return rev;
};

// id start with 1
export const generateArticle = (em: EntityManager, id: number) => {
  const article = new Article();
  article.id = id;
  article.revisions.add(...range(1,id+1).map((i) => genRevision(article, i, generatePdf(em))));
  article.createTime = new Date(articleTime);
  article.createTime.setFullYear(2000 + id);
  article.lastUpdateTime = articleTime;
  article.latestRevisionNumber = id;
  article.owner = em.getReference(User, (id % 2 == 1 ? normalUser1 : normalUser2).id);
  return article;
};
