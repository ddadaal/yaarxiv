import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import * as deleteApi from "yaarxiv-api/article/delete";
import { login, adminUser, normalUser1 } from "./utils/login";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { insertData } from "./utils/data";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertData(server.orm.em, 2);

});

afterEach(async () => {
  await server.close();
});


async function assertCount(articleCount: number, revisionCount: number) {
  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(articleCount);
  expect(await em.getRepository(ArticleRevision).count()).toBe(revisionCount);
}

it("delete the article and all revisions as admin", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/1",
    ...login(server, adminUser),
  });

  const info = resp.json();
  expect(resp.statusCode).toBe(200);
  await assertCount(1,2);
});

it("delete the article and all revisions as owner", async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/1",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
  await assertCount(1,2);
});

it("cannot delete the article and all revisions as neither owner nor admin",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/2",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
  await assertCount(2,3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await server.inject({
    method: deleteApi.endpoint.method,
    url: "/articles/3",
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(404);
});
