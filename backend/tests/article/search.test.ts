import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { range } from "../../src/utils/array";
import { Article } from "../../src/entities/Article";
import * as searchApi from "yaarxiv-api/article/search";
import { generateArticle } from "./utils/generateArticles";
import { insertUserInfo } from "./utils/login";
import { fillData } from "./utils/data";
import { EntityManager } from "@mikro-orm/core";

const articleCount = 12;

let server: FastifyInstance;
let em: EntityManager;

beforeEach(async () => {
  server = await startApp();

  em = await fillData(server, articleCount);
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
  await t(6, undefined, 2005);
  await t(4, 2004, 2007);


});
