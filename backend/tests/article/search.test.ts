import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as searchApi from "yaarxiv-api/article/search";
import { createMockArticles } from "./utils/data";
import { commonKeyword } from "./utils/generateArticles";
import { range } from "@/utils/array";
import { Article } from "@/entities/Article";
import { getRepository } from "typeorm";

const articleCount = 12;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await createMockArticles(articleCount);
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

  await t(3, 2010);
  await t(5, undefined, 2005);
  await t(4, 2004, 2007);


});


it("should return the articles with ALL of specified keyword", async () => {

  const resp = await server.inject({
    ...searchApi.endpoint,
    query: { keywords: [commonKeyword, "1"]},
  });

  const data = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(data.totalCount).toBe(4);
  expect(data.results.map((x) => x.articleId)).toEqual(["1","10","11","12"]);
});

it("should return the articles with specified single keyword", async () => {

  const resp = await server.inject({
    ...searchApi.endpoint,
    query: { keywords: "8" },
  });

  const data = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(data.totalCount).toBe(1);
  expect(data.results.map((x) => x.articleId)).toEqual(["8"]);
});

it("should return articls with ALL of specified authors", async () => {
  const resp = await server.inject({
    ...searchApi.endpoint,
    query: { authorNames: ["CJD", "CX"]},
  });

  const data = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(data.totalCount).toBe(6);
  expect(data.results.map((x) => x.articleId)).toEqual(range(2, 14, 2).map((x) => x + ""));
});

it("should not return admin set private articles", async () => {
  // set article 1 into admin private
  const id = 1;
  const repo = getRepository(Article);
  const article = await repo.findOne(id);
  if (!article) {
    fail(`Article ${id} does not exist`);
  }
  article.adminSetPublicity = false;
  await repo.save(article);

  const resp = await server.inject({
    ...searchApi.endpoint,
  });

  const data= resp.json() as searchApi.SearchArticleSchema["responses"]["200"];
  expect(data.totalCount).toBe(articleCount - 1);
});

it("should not return owner set private articles", async () => {
  // set article 1 into admin private
  const id = 1;
  const repo = getRepository(Article);
  const article = await repo.findOne(id);
  if (!article) {
    fail(`Article ${id} does not exist`);
  }
  article.ownerSetPublicity = false;
  await repo.save(article);

  const resp = await server.inject({
    ...searchApi.endpoint,
  });

  const data= resp.json() as searchApi.SearchArticleSchema["responses"]["200"];
  expect(data.totalCount).toBe(articleCount - 1);
});
