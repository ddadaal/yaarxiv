import { FastifyInstance } from "fastify/types/instance";
import { range } from "../../src/utils/array";
import * as api from "yaarxiv-api/api/dashboard/getArticles";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { dashboardGetArticlesRoute } from "@/routes/dashboard/getArticles";
import { expectCodeAndJson } from "tests/utils/assertions";

const articleCount = 24;

let server: FastifyInstance;

let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  await createMockArticles(server, articleCount, users);
});

afterEach(async () => {
  await server.close();
});

it("return 401 if not logged in.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expectCodeAndJson(resp, 401);
});

it("return the first page of articles whose owner is the logged in user.", async () => {
  const resp = await callRoute(server, dashboardGetArticlesRoute, { query: { } }, users.normalUser1);

  const payload = expectCodeAndJson(resp, 200);
  expect(payload.articles).toHaveLength(10);

  expect(payload.articles.map((x) => x.id % 2 === 1)).toEqual(range(0, 10).map(() => true));
  expect(payload.totalCount).toBe(12);
});

it("return the second page of articles with query.", async () => {
  const resp = await callRoute(server, dashboardGetArticlesRoute, {
    query: { page: 2 },
  }, users.normalUser1);

  const payload = expectCodeAndJson(resp, 200);

  expect(payload.articles).toHaveLength(2);
  expect(payload.totalCount).toBe(12);
});

it("return empty if a user has no article", async () => {
  const resp = await callRoute(server, dashboardGetArticlesRoute, {
    query: {},
  }, users.adminUser);

  const payload = expectCodeAndJson(resp, 200);

  expect(payload.articles).toHaveLength(0);
  expect(payload.totalCount).toBe(0);
});
