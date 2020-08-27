import { ArticleRevision } from "../../../src/entities/ArticleRevision";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { Author } from "yaarxiv-api/article/models";

const pdfLink = "https://docs.microsoft.com/en-us/dotnet/opbuildpdf/core/toc.pdf?branch=live";

const articleTime = new Date();

const authors: Author[] = [
  { name: "CJD", affiliation: "NJU" },
  { name: "CJY" },
];

const genRevision = (article: Article, revisionId: number) => {
  const rev = new ArticleRevision();
  rev.title = `Article ${article.id} Revision ${revisionId}`;
  rev.revisionNumber = revisionId;
  rev.authors = authors;
  rev.abstract = rev.title + " Abstract";
  rev.time = articleTime;
  rev.pdfLink = pdfLink;
  rev.category = rev.title + "Category";
  rev.keywords = [article.id+""];
  return rev;
};

export const generateArticle = (id: number) => {
  const article = new Article();
  article.id = id;
  article.revisions = range(0,id+1).map((i) => genRevision(article, i));
  article.createTime = new Date(articleTime);
  article.createTime.setFullYear(2000 + id);
  article.lastUpdateTime = articleTime;
  article.latestRevisionNumber = article.revisions.length-1;
  return article;
};
