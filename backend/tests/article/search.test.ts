import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import * as searchApi from "yaarxiv-api/article/search";
import { insertData } from "./utils/data";
import { commonKeyword } from "./utils/generateArticles";

const articleCount = 12;


let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertData(articleCount);
});

afterEach(async () => {
  await server.close();
});


it("should return the first page (10) of articles when no query is input.", async () => {
  const resp = await server.inject({ ...searchApi.endpoint });

  const payload = resp.json();
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
  await t(6, undefined, 2005);
  await t(4, 2004, 2007);


});


it("should return the articles with ALL of specified keyword", async () => {

  const resp = await server.inject({
    ...searchApi.endpoint,
    query: { keywords: [commonKeyword, "1"]},
  });

  const data = resp.json() as searchApi.SearchArticleSchema["responses"]["200"];

  expect(data.totalCount).toBe(3);
  expect(data.results.map((x) => x.articleId)).toEqual(["1","10","11"]);
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

