import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/admin/changeArticlePublicity";
import { adminUser, login, normalUser1 } from "../article/utils/login";
import { createMockArticles } from "tests/article/utils/data";
import { replacePathInEndpoint } from "tests/utils/replacePathInEndpoint";
import { getRepository } from "typeorm";
import { Article } from "@/entities/Article";

const articleCount = 3;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await createMockArticles(articleCount);

});

afterEach(async () => {
  await server.close();
});

it("change the admin set publicity of an article", async () => {

  const articleId = 1;

  let article = await getRepository(Article).findOne(articleId);
  if (!article) { fail(`Article ${articleId} does not exists.`);}
  expect(article.adminSetPublicity).toBe(true);
  expect(article.ownerSetPublicity).toBe(true);


  const resp = await server.inject({
    ...replacePathInEndpoint(api.endpoint, { articleId }),
    payload: { publicity: false },
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
  const data = resp.json() as api.ChangeArticleAdminSetPublicitySchema["responses"]["200"];

  expect(data.publicity).toBe(false);
  article = await getRepository(Article).findOne(articleId);
  if (!article) { fail(`Article ${articleId} does not exists.`);}
  expect(article.adminSetPublicity).toBe(false);
  expect(article.ownerSetPublicity).toBe(true);

});

it("return 403 if the logged in user is not admin", async () => {

  const articleId = 1;

  const resp = await server.inject({
    ...replacePathInEndpoint(api.endpoint, { articleId }),
    payload: { publicity: false },
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
});

it("return 404 if article does not exist", async () => {

  const articleId = 404;

  const resp = await server.inject({
    ...replacePathInEndpoint(api.endpoint, { articleId }),
    payload: { publicity: false },
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(404);
});
