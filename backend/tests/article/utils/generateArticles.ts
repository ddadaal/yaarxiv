import { ArticleRevision } from "../../../src/entities/ArticleRevision";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { Author } from "yaarxiv-api/article/models";
import { PdfUpload } from "../../../src/entities/PdfUpload";
import { generatePdf } from "./data";
import { MockUsers } from "tests/utils/data";
import { Reference } from "@mikro-orm/core";

const articleTime = new Date();

const authors: Author[][] = [
  [{ name: "CJD", affiliation: "NJU" }, { name: "CX", affiliation: "NJU" }, { name: "CST", affiliation: "NJU" }],
  [{ name: "CJY" }, { name: "CJD", affiliation: "NJU" }],
];

export const commonKeyword = "commonKeyword";

const genRevision = (article: Article, revisionId: number, pdf: PdfUpload) => {
  const rev = new ArticleRevision();
  rev.title = `Article ${article.id} Revision ${revisionId}`;
  rev.revisionNumber = revisionId;
  rev.authors = authors[revisionId % 2];
  rev.abstract = rev.title + " Abstract";
  rev.time = articleTime;
  rev.pdf = pdf;
  rev.category = rev.title + "Category";
  rev.keywords = [commonKeyword, article.id+""];
  return rev;
};

export const generateArticle = (id: number, users: MockUsers) => {
  const article = new Article();
  article.id = id;
  article.createTime = new Date(articleTime);
  article.createTime.setFullYear(2000 + id);
  article.lastUpdateTime = articleTime;
  article.revisions.add(...range(1, id+1).map((i) => genRevision(article, i, generatePdf(article.owner))));
  article.latestRevision = Reference.create(article.revisions[article.revisions.length-1]);
  article.owner = Reference.create(id % 2 == 1 ? users.normalUser1 : users.normalUser2);
  return article;
};
