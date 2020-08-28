import fastify, { FastifyInstance } from "fastify";
import { startApp } from "../../src/app";
import { range } from "../../src/utils/array";
import { Article } from "../../src/entities/Article";
import * as deleteApi from "yaarxiv-api/article/delete";
import { generateArticle } from "./utils/generateArticles";
import { insertUserInfo, login, adminUser, normalUser1 } from "./utils/login";
import { ArticleRevision } from "../../src/entities/ArticleRevision";

let articles: Article[];

let server: FastifyInstance;

let articleRepo;

let articleRevRepo;

beforeEach(async () => {
  server = await startApp();

  await insertUserInfo(server);

  articles = range(0, 2).map(generateArticle);
  // append items
  articleRepo = server.orm.getRepository(Article);
  await articleRepo.persistAndFlush(articles);

});

afterEach(async () => {
  await server.close();
});


it("delete the article and all revisions as admin", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/0",
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
  expect(await server.orm.getRepository(Article).count()).toBe(1);
  expect(await server.orm.getRepository(ArticleRevision).count()).toBe(2);
});

it("delete the article and all revisions as owner", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/1",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
  expect(await server.orm.getRepository(Article).count()).toBe(1);
  expect(await server.orm.getRepository(ArticleRevision).count()).toBe(1);
});

it("cannot delete the article and all revisions as neither owner nor admin",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/0",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
  expect(await server.orm.getRepository(Article).count()).toBe(2);
  expect(await server.orm.getRepository(ArticleRevision).count()).toBe(3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/3",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(404);
});
