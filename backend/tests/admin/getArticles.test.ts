import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { range } from "../../src/utils/array";
import { Article } from "../../src/entities/Article";
import { getRepository } from "typeorm";
import * as api from "yaarxiv-api/admin/getArticles";
import { adminUser, insertUserInfo, login, normalUser1 } from "../article/utils/login";
import { generateArticle } from "../article/utils/generateArticles";

const articleCount = 12;

let articles: Article[];

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertUserInfo();
  articles = range(0, articleCount).map(generateArticle);

  // append items
  const articleRepo = getRepository(Article);
  await articleRepo.save(articles);
});

afterEach(async () => {
  await server.close();
});

it("return 401 if not admin.", async () => {
  let resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);

  resp = await server.inject({
    ...api.endpoint,
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
  // 1 10 11
  expect(payload.articles).toHaveLength(3);
});