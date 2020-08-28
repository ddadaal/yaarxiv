import { FastifyInstance } from "fastify";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import * as deleteApi from "yaarxiv-api/article/delete";
import { login, adminUser, normalUser1 } from "./utils/login";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { dropData, fillData } from "./utils/data";
import { EntityManager } from "@mikro-orm/core";

let server: FastifyInstance;

let articleRepo;

let articleRevRepo;

let em: EntityManager;

beforeEach(async () => {
  server = await startApp();

  em = await fillData(server, 2);
  articleRepo = em.getRepository(Article);
  articleRevRepo = em.getRepository(ArticleRevision);

});

afterEach(async () => {
  await dropData(server);
  await server.close();
});


it("delete the article and all revisions as admin", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/0",
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
  expect(await articleRepo.count()).toBe(1);
  expect(await articleRevRepo.count()).toBe(2);
});

it("delete the article and all revisions as owner", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/1",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
  expect(await articleRepo.count()).toBe(1);
  expect(await articleRevRepo.count()).toBe(1);
});

it("cannot delete the article and all revisions as neither owner nor admin",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/0",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
  expect(await articleRepo.count()).toBe(2);
  expect(await articleRevRepo.count()).toBe(3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/3",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(404);
});
