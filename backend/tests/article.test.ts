import { FastifyInstance } from "fastify/types/instance";
import { Author } from "yaarxiv-api/article/models";
import { startApp } from "../src/app";
import { range } from "../src/utils/array";
import { Article } from "../src/entities/Article";
import { getRepository } from "typeorm";
import * as searchApi from "yaarxiv-api/article/search";
import { ArticleRevision } from "../src/entities/ArticleRevision";

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

const genArticle = (i: number) => {
  const article = new Article();
  article.id = i;
  article.revisions = range(0,i+1).map((i) => genRevision(article, i));
  article.createTime = new Date(articleTime);
  article.createTime.setFullYear(2000 + i);
  article.lastUpdateTime = articleTime;
  article.latestRevisionNumber = article.revisions.length-1;
  return article;
};

const articleCount = 12;

let articles: Article[];

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  articles = range(0, articleCount).map(genArticle);

  // append items
  const articleRepo = getRepository(Article);
  await articleRepo.save(articles);
});

afterEach(async () => {
  await server.close();
});

it("should return the first page (10) of articles when no query is input.", async () => {
  const resp = await server.inject({ ...searchApi.endpoint });

  expect(resp.statusCode).toBe(200);
  const json = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(json.totalCount).toBe(articleCount);
  expect(json.results.length).toBe(10);
});

it("should paginate results when page is set", async () => {
  const resp = await server.inject({
    ...searchApi.endpoint,
    query: { page: "2" },
  });

  expect(resp.statusCode).toBe(200);
  const json = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(json.totalCount).toBe(articleCount);
  expect(json.results.length).toBe(2);
});

it("should filter the title with searchText if searchText query is input", async () => {
  const resp = await server.inject({
    ...searchApi.endpoint,
    query: { searchText: "9" },
  });

  expect(resp.statusCode).toBe(200);
  const json = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(json.totalCount).toBe(1);
  expect(json.results[0].articleId).toBe("9");
});

// Can use each function of jest,
// but my VSCode test explorer won't parse it correctly
// so just use plain test
it("should filter according to start and end", async () => {

  const t = async (expected: number, start?: number, end?: number) => {

    const resp = await server.inject({
      ...searchApi.endpoint,
      query: {
        ...start ? { startYear: start + "" } : undefined,
        ...end ? { endYear: end + "" } : undefined,
      },
    });

    expect(resp.json().totalCount).toBe(expected);
  };

  await t(2, 2010);
  // await t(6, undefined, 2005);
  await t(4, 2004, 2007);


});
