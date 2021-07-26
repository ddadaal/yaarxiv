import { ArticleRevision } from "@/entities/ArticleRevision";
import { Article } from "@/entities/Article";
import { range } from "@/utils/array";
import { Author } from "yaarxiv-api/api/article/models";
import { UploadedFile } from "@/entities/UploadedFile";
import { MockUsers } from "tests/utils/data";
import { IdentifiedReference, Reference } from "@mikro-orm/core";
import { User } from "@/entities/User";
import { FastifyInstance } from "fastify";
import { toRef } from "@/utils/orm";

const articleTime = new Date();

const authors: Author[][] = [
  [{ name: "CJD", affiliation: "NJU" }, { name: "CX", affiliation: "NJU" }, { name: "CST", affiliation: "NJU" }],
  [{ name: "CJY" }, { name: "CJD", affiliation: "NJU" }],
];

export const commonKeyword = "commonKeyword";

const genRevision = (article: Article, revisionId: number, pdf: UploadedFile) => {
  const title = `Article ${article.id} Revision ${revisionId}`;
  const rev = new ArticleRevision({
    title,
    revisionNumber: revisionId,
    authors: authors[revisionId % 2],
    abstract: title + " Abstract",
    time: articleTime,
    pdf,
    category: title + "Category",
    article: article,
    keywords: [commonKeyword, article.id+""],
  });

  return rev;
};

export const generateArticle = (id: number, users: MockUsers) => {
  const createTime = new Date(articleTime);
  createTime.setFullYear(2000 + id);

  const article = new Article({
    id,
    owner: id % 2 === 1 ? users.normalUser1 : users.normalUser2,
    createTime,
    lastUpdateTime: createTime,
  });

  const revisions = range(1, id+1).map((i) => genRevision(article, i, generatePdf(article.owner)));

  article.latestRevision = toRef(revisions[revisions.length-1]);
  article.revisions.add(...revisions);

  return article;
};

export function generatePdf(owner: IdentifiedReference<User>) {

  const pdf = new UploadedFile({ user: owner, filename: "test.pdf" });
  pdf.user = owner;
  pdf.filename = "test";
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
