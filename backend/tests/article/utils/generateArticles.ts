import { ArticleRevision } from "@/entities/ArticleRevision";
import { Article } from "@/entities/Article";
import { range } from "@/utils/array";
import { Author } from "yaarxiv-api/api/article/models";
import { UploadedFile } from "@/entities/UploadedFile";
import { MockUsers } from "tests/utils/data";
import { FastifyInstance } from "fastify";
import { toRef } from "@/utils/orm";
import { getPathForArticleFile } from "@/services/articleFiles";

const articleTime = new Date();

const authors: Author[][] = [
  [
    { name: "CJD", affiliation: "NJU", correspondingAuthor: false },
    { name: "CX", affiliation: "NJU", correspondingAuthor: true },
    { name: "CST", affiliation: "NJU", correspondingAuthor: false },
  ], [
    { name: "CJY", affiliation: "NJU", correspondingAuthor: false },
    { name: "CJD", affiliation: "NJU", correspondingAuthor: true },
  ],
];

export const commonKeyword = "commonKeyword";

const genRevision = (article: Article, revisionId: number, pdf: UploadedFile) => {
  const title = `Article ${article.id} Revision ${revisionId}`;
  const keywords = [commonKeyword, article.id+""];

  const rev = new ArticleRevision({
    cnTitle: title,
    cnKeywords: keywords,
    revisionNumber: revisionId,
    authors: authors[revisionId % 2],
    abstract: title + " Abstract",
    time: articleTime,
    pdf,
    category: title + "Category",
    article: article,
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

  const revisions = range(1, id+1).map((i) => genRevision(article, i, generatePdf(article)));

  article.latestRevision = toRef(revisions[revisions.length-1]);
  article.revisions.add(...revisions);

  return article;
};

export function generatePdf(article: Article) {

  const filename = "test.pdf";

  const pdf = new UploadedFile({
    user: article.owner,
    filePath: getPathForArticleFile(article, filename),
  });

  return pdf;
}

export async function createMockArticles(
  fastify: FastifyInstance,
  articleCount: number,
  users: MockUsers,
) {
  // insert pdf
  // const pdfRepo = getRepository(PdfUpload);
  // const pdf = generatePdf();
  // await pdfRepo.save(pdf);

  // insert articles
  const articles = range(1, articleCount + 1).map((i) => generateArticle(i, users));
  await fastify.orm.em.persistAndFlush(articles);

  return articles;

}
