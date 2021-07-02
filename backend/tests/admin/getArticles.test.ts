import { FastifyInstance } from "fastify/types/instance";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute";
import { Article } from "@/entities/Article";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { adminGetArticlesRoute } from "@/routes/admin/getArticles";

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

it("return 401 if not login.", async () => {
  const resp = await callRoute(server, adminGetArticlesRoute, { query: {} });

  expect(resp.statusCode).toBe(401);
});

it("return 403 if not admin", async () => {
  const resp = await callRoute(server, adminGetArticlesRoute, { query: {} }, users.normalUser1);

  expect(resp.statusCode).toBe(403);
});

it("return first page articles with no query", async () => {
  const resp = await callRoute(server, adminGetArticlesRoute, { query: {} }, users.adminUser);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();
  expect(payload.articles).toHaveLength(10);
  expect(payload.totalCount).toBe(articleCount);
});

it("return second page articles with page=2 query.", async () => {
  const resp = await callRoute(server, adminGetArticlesRoute, { query: {
    page: 2,
  } }, users.adminUser);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();
  expect(payload.articles).toHaveLength(2);
  expect(payload.totalCount).toBe(articleCount);
});

it("return filtered articles with searchWord query.", async () => {
  const resp = await callRoute(server, adminGetArticlesRoute, { query: {
    page: 1,
    searchWord: "1",
  } }, users.adminUser);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();
  // 1 10 11 12
  expect(payload.articles).toHaveLength(4);
});

it("return articles with their owner", async () => {
  const resp = await callRoute(server, adminGetArticlesRoute, { query: {
    searchWord: "12",
  } }, users.adminUser);

  expect(resp.statusCode).toBe(200);
  const payload = resp.json<200>();
  // 12
  expect(payload.articles).toHaveLength(1);
  const article = payload.articles[0];
  expect(article.owner).toEqual({ id: users.normalUser2.id, name: users.normalUser2.name });

});
