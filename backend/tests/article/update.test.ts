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
  codeLink: "https://github.com/test/test",
};

it("return 403 if not the owner.", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    url: "/articles/2",
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);

});
it("update an article.", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    url: "/articles/2",
    payload,
    ...login(server, normalUser2),
  });

  expect(resp.statusCode).toBe(201);
  const repo =  getRepository(Article);
  expect(await repo.count()).toBe(articleCount);
  expect(await getRepository(ArticleRevision).count()).toBe(1+2+1);
  expect(resp.json().revisionNumber).toBe(3);

  const article = await repo.findOne(2, { relations: [ "revisions" ]});
  if (!article ) {
    fail("Article is undefined.");
  }
  expect(article.latestRevisionNumber).toBe(3);
  expect(article.revisions[2].abstract).toBe(payload.abstract);
  expect(article.revisions[2].codeLink).toBe(payload.codeLink);

});
