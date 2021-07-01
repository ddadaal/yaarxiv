import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import * as api from "yaarxiv-api/article/update";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute"; import { updateArticleRoute } from "@/routes/article/update";

const articleCount = 2;

let server: FastifyInstance;
let users: MockUsers;
let articles: Article[];

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, articleCount, users);
});

afterEach(async () => {
  await server.close();
});

const payload: api.UpdateArticleSchema["body"] = {
  abstract: "123",
  keywords: ["k1", "k2"],
  codeLink: "https://github.com/test/test",
};

it("should reject bad code link", async () => {
  // bad code link
  const badPayload = {
    ...payload,
    codeLink: "https://github.com/test",
  };

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: 1 },
    body: badPayload,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(400);
});

it("return 403 if not the owner.", async () => {

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: 1 },
    body: payload,
  }, users.normalUser2);

  expect(resp.statusCode).toBe(403);

});
it("update an article.", async () => {

  const article = articles[1];

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: article.id },
    body: payload,
  }, users.normalUser2);

  expect(resp.statusCode).toBe(201);

  expect(resp.json<201>().revisionNumber).toBe(3);

  await reloadEntity(article);

  const em = server.orm.em.fork();
  await em.populate(article, ["latestRevision", "revisions"]);

  const latestRevision = article.latestRevision.getEntity();

  expect(latestRevision.revisionNumber).toBe(3);
  expect(article.revisions.length).toBe(3);
  expect(latestRevision.abstract).toBe(payload.abstract);
  expect(latestRevision.codeLink).toBe(payload.codeLink);

});
