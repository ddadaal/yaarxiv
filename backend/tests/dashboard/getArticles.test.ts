import { FastifyInstance } from "fastify/types/instance";
import { range } from "../../src/utils/array";
import * as api from "yaarxiv-api/dashboard/getArticles";
import { createMockArticles } from "tests/article/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { Article } from "@/entities/Article";
import { callRoute } from "@/utils/callRoute";
import { dashboardGetArticlesRoute } from "@/routes/dashboard/getArticles";

const articleCount = 24;

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

it("return 401 if not logged in.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);
});

it("return the first page of articles whose owner is the logged in user.", async () => {
  const resp = await callRoute(server, dashboardGetArticlesRoute, { query: { } }, users.normalUser1);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();
  expect(payload.articles).toHaveLength(10);

  expect(payload.articles.map((x) => parseInt(x.id) % 2 === 1)).toEqual(range(0, 10).map(() => true));
  expect(payload.totalCount).toBe(12);
});

it("return the second page of articles with query.", async () => {
  const resp = await callRoute(server, dashboardGetArticlesRoute, {
    query: { page: 2 },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();

  expect(payload.articles).toHaveLength(2);
  expect(payload.totalCount).toBe(12);
});

it("return empty if a user has no article", async () => {
  const resp = await callRoute(server, dashboardGetArticlesRoute, {
    query: {},
  }, users.adminUser);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();

  expect(payload.articles).toHaveLength(0);
  expect(payload.totalCount).toBe(0);
});
