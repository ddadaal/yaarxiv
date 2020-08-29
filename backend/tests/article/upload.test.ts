import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { range } from "../../src/utils/array";
import { Article } from "../../src/entities/Article";
import { getRepository } from "typeorm";
import * as api from "yaarxiv-api/article/upload";
import { generateArticle } from "./utils/generateArticles";
import { insertUserInfo, login, normalUser1 } from "./utils/login";

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

const payload: api.UploadArticleSchema["body"] = {
  abstract: "123",
  authors: ["author"],
  keywords: ["k1", "k2"],
  pdfToken: "1231212",
  title: "123",
};

it("return 401 if not logged in.", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    payload,
  });
  expect(resp.statusCode).toBe(401);
});

it("upload an article.", async () => {


  const resp = await server.inject({
    ...api.endpoint,
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(201);
  const repo =  getRepository(Article);
  expect(await repo.count()).toBe(articleCount+1);

  const article = await repo.findOne(resp.json().id, { relations: [ "revisions" ]});
  expect(article).not.toBeUndefined();
  expect(article!.latestRevisionNumber).toBe(1);
  expect(article!.revisions[0].abstract).toBe(payload.abstract);
  expect(article!.revisions[0].title).toBe(payload.title);

});
