import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import { getRepository } from "typeorm";
import * as deleteApi from "yaarxiv-api/article/delete";
import { login, adminUser, normalUser1 } from "./utils/login";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { insertData } from "./utils/data";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertData(2);

});

afterEach(async () => {
  await server.close();
});


it("delete the article and all revisions as admin", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/2",
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
  expect(await getRepository(Article).count()).toBe(1);
  expect(await getRepository(ArticleRevision).count()).toBe(1);
});

it("delete the article and all revisions as owner", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/1",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
  expect(await getRepository(Article).count()).toBe(1);
  expect(await getRepository(ArticleRevision).count()).toBe(2);
});

it("cannot delete the article and all revisions as neither owner nor admin",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/2",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
  expect(await getRepository(Article).count()).toBe(2);
  expect(await getRepository(ArticleRevision).count()).toBe(3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/3",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(404);
});
