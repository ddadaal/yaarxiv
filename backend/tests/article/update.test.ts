import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import { getRepository } from "typeorm";
import * as api from "yaarxiv-api/article/update";
import { login, normalUser1, normalUser2 } from "./utils/login";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { insertData } from "./utils/data";

const articleCount = 2;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertData(articleCount);
});

afterEach(async () => {
  await server.close();
});

const payload: api.UpdateArticleSchema["body"] = {
  abstract: "123",
  keywords: ["k1", "k2"],
};

it("return 403 if not the owner.", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    url: "/articles/0",
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);

});
it("update an article.", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    url: "/articles/0",
    payload,
    ...login(server, normalUser2),
  });

  const info = resp.json();
  expect(resp.statusCode).toBe(201);
  const repo =  getRepository(Article);
  expect(await repo.count()).toBe(articleCount);
  expect(await getRepository(ArticleRevision).count()).toBe(1+2+1);
  expect(resp.json().revisionNumber).toBe(2);

  const article = await repo.findOne(0, { relations: [ "revisions" ]});
  expect(article).not.toBeUndefined();
  expect(article!.latestRevisionNumber).toBe(2);
  expect(article!.revisions[1].abstract).toBe(payload.abstract);

});
