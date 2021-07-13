import { FastifyInstance } from "fastify";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { commonKeyword } from "./utils/generateArticles";
import { range } from "@/utils/array";
import { Article } from "@/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { searchArticleRoute } from "@/routes/article/search";
import { expectCodeAndJson } from "tests/utils/assertions";

const articleCount = 12;

let server: FastifyInstance;
let users: MockUsers;
let articles: Article[];

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, articleCount, users);
});

afterEach(async () => {
  await server.close();
});


it("should return the first page (10) of articles when no query is input.", async () => {
  const resp = await callRoute(server, searchArticleRoute, { query: {} });

  const json = expectCodeAndJson(resp, 200);

  expect(json.totalCount).toBe(articleCount);
  expect(json.results.length).toBe(10);
});

it("should paginate results when page is set", async () => {
  const resp = await callRoute(server, searchArticleRoute, { query: {
    page: 2,
  } });

  const json = expectCodeAndJson(resp, 200);

  expect(json.totalCount).toBe(articleCount);
  expect(json.results.length).toBe(2);
});

it("should filter the title with searchText if searchText query is input", async () => {
  const resp = await callRoute(server, searchArticleRoute, { query: {
    searchText: "9",
  } });

  const json = expectCodeAndJson(resp, 200);

  expect(json.totalCount).toBe(1);
  expect(json.results[0].articleId).toBe(9);
});

// Can use each function of jest,
// but my VSCode test explorer won't parse it correctly
// so just use plain test
it("should filter according to start and end", async () => {

  const t = async (expected: number, start?: number, end?: number) => {

    const resp = await callRoute(server, searchArticleRoute, {
      query: {
        ...start ? { startYear: start } : undefined,
        ...end ? { endYear: end } : undefined,
      },
    });

    expect(expectCodeAndJson(resp, 200).totalCount).toBe(expected);
  };

  await t(3, 2010);
  await t(5, undefined, 2005);
  await t(4, 2004, 2007);


});


it("should return the articles with ALL of specified keyword", async () => {

  const resp = await callRoute(server, searchArticleRoute, {
    query: { keywords: [commonKeyword, "1"]},
  });

  const data = resp.json<200>();

  expect(data.totalCount).toBe(4);
  expect(data.results.map((x) => x.articleId)).toEqual([1,10,11,12]);
});

it("should return the articles with specified single keyword", async () => {

  const resp = await callRoute(server, searchArticleRoute, {
    query: { keywords: ["8"]},
  });

  const data = expectCodeAndJson(resp, 200);

  expect(data.totalCount).toBe(1);
  expect(data.results.map((x) => x.articleId)).toEqual([8]);
});

it("should return articls with ALL of specified authors", async () => {
  const resp = await callRoute(server, searchArticleRoute, {
    query: { authorNames: ["CJD", "CX"]},
  });

  const data = resp.json<200>();

  expect(data.totalCount).toBe(6);
  expect(data.results.map((x) => x.articleId)).toEqual(range(2, 14, 2));
});

it("should not return admin set private articles", async () => {
  const article = articles[0];

  article.adminSetPublicity = false;
  await server.orm.em.flush();

  const resp = await callRoute(server, searchArticleRoute, { query: {} });

  const data= resp.json<200>();
  expect(data.totalCount).toBe(articleCount - 1);
});

it("should not return owner set private articles", async () => {
  const article = articles[0];

  article.ownerSetPublicity = false;
  await server.orm.em.flush();

  const resp = await callRoute(server, searchArticleRoute, { query: {} });

  const data= resp.json<200>();
  expect(data.totalCount).toBe(articleCount - 1);
});
