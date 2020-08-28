import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { range } from "../../src/utils/array";
import { Article } from "../../src/entities/Article";
import { getRepository } from "typeorm";
import * as api from "yaarxiv-api/dashboard/getArticles";
import { insertUserInfo, login, normalUser1 } from "../article/utils/login";
import { generateArticle } from "../article/utils/generateArticles";

const articleCount = 24;

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

it("return 401 if not logged in.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);
});

it("return the first page of articles whose owner is the logged in user.", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
  const payload = resp.json() as api.UserGetArticleInfoSchema["responses"]["200"];
  expect(payload.articles).toHaveLength(10);
  expect(payload.articles.map((x) => parseInt(x.id) % 2 === 1)).toEqual(range(0, 10).map(() => true));
  expect(payload.totalCount).toBe(12);
});

it("return the first page of articles whose owner is the logged in user.", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, normalUser1),
    query: { page: "2" },
  });

  expect(resp.statusCode).toBe(200);
  const payload = resp.json() as api.UserGetArticleInfoSchema["responses"]["200"];
  expect(payload.articles).toHaveLength(2);
  expect(payload.totalCount).toBe(12);
});
