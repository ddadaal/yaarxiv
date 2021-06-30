import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/admin/getArticles";
import { adminUser, login, normalUser1, normalUser2 } from "../article/utils/login";
import { createMockArticles } from "tests/article/utils/data";

const articleCount = 12;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await createMockArticles(articleCount);
});

afterEach(async () => {
  await server.close();
});

it("return 401 if not login.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);

});

it("return 403 if not admin", async () => {
  const resp = await server.inject({
    ...api.endpoint ,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
});

it("return first page articles with no query", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
  const payload = resp.json() as api.AdminGetArticlesSchema["responses"]["200"];
  expect(payload.articles).toHaveLength(10);
});

it("return second page articles with page=2 query.", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
    query: { page: "2" },
  });

  expect(resp.statusCode).toBe(200);
  const payload = resp.json() as api.AdminGetArticlesSchema["responses"]["200"];
  expect(payload.articles).toHaveLength(2);
});

it("return filtered articles with searchWord query.", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
    query: { searchWord: "1" },
  });

  expect(resp.statusCode).toBe(200);
  const payload = resp.json() as api.AdminGetArticlesSchema["responses"]["200"];
  // 1 10 11 12
  expect(payload.articles).toHaveLength(4);
});

it("return articles with their owner", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
    query: { searchWord: "12" },
  });

  expect(resp.statusCode).toBe(200);
  const payload = resp.json() as api.AdminGetArticlesSchema["responses"]["200"];
  // 1 10 11 12
  expect(payload.articles).toHaveLength(1);
  const article = payload.articles[0];
  expect(article.owner).toEqual({ id: normalUser2.id, name: normalUser2.name });

});
