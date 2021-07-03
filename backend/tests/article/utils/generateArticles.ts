import { ArticleRevision } from "../../../src/entities/ArticleRevision";
import { Article } from "../../../src/entities/Article";
import { range } from "../../../src/utils/array";
import { Author } from "yaarxiv-api/api/article/models";
import { UploadedFile } from "../../../src/entities/UploadedFile";
import { MockUsers } from "tests/utils/data";
import { IdentifiedReference, Reference } from "@mikro-orm/core";
import { User } from "@/entities/User";
import { FastifyInstance } from "fastify";

const articleTime = new Date();

const authors: Author[][] = [
  [{ name: "CJD", affiliation: "NJU" }, { name: "CX", affiliation: "NJU" }, { name: "CST", affiliation: "NJU" }],
  [{ name: "CJY" }, { name: "CJD", affiliation: "NJU" }],
];

export const commonKeyword = "commonKeyword";

const genRevision = (article: Article, revisionId: number, pdf: UploadedFile) => {
  const rev = new ArticleRevision();
  rev.title = `Article ${article.id} Revision ${revisionId}`;
  rev.revisionNumber = revisionId;
  rev.authors = authors[revisionId % 2];
  rev.abstract = rev.title + " Abstract";
  rev.time = articleTime;
  rev.pdf = Reference.create(pdf);
  rev.category = rev.title + "Category";
  rev.article = Reference.create(article);
  rev.keywords = [commonKeyword, article.id+""];
  return rev;
};

export const generateArticle = (id: number, users: MockUsers) => {
  const article = new Article();
  article.id = id;
  article.createTime = new Date(articleTime);
  article.createTime.setFullYear(2000 + id);
  article.lastUpdateTime = articleTime;
  article.owner = Reference.create(id % 2 === 1 ? users.normalUser1 : users.normalUser2);
  article.revisions.add(...range(1, id+1).map((i) => genRevision(article, i, generatePdf(article.owner))));
  article.latestRevision = Reference.create(article.revisions[article.revisions.length-1]);
  return article;
};

export function generatePdf(owner: IdentifiedReference<User>) {

  const pdf = new UploadedFile();
  pdf.user = owner;
  pdf.filePath = "test";
  return pdf;
}

export async function createMockArticles(fastify: FastifyInstance, articleCount: number, users: MockUsers) {
  // insert pdf
  // const pdfRepo = getRepository(PdfUpload);
  // const pdf = generatePdf();
  // await pdfRepo.save(pdf);

  // insert articles
  const articles = range(1, articleCount + 1).map((i) => generateArticle(i, users));
  await fastify.orm.em.persistAndFlush(articles);

  return articles;

}
