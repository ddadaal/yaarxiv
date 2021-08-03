import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import * as api from "yaarxiv-api/api/article/update";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute"; import { updateArticleRoute } from "@/routes/article/update";
import { expectCodeAndJson } from "tests/utils/assertions";

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
  cnKeywords: ["k1", "k2"],
  codeLink: "https://github.com/test/test",
  authors: [{ name: "author" }],
  cnTitle: "123",
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

  expectCodeAndJson(resp, 400);
});

it("return 403 if not the owner.", async () => {

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: 1 },
    body: payload,
  }, users.normalUser2);

  expectCodeAndJson(resp, 403);

});
it("update an article.", async () => {

  const article = articles[1];
  const prevLatestRev = article.latestRevision.getEntity();

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: article.id },
    body: payload,
  }, users.normalUser2);

  const json = expectCodeAndJson(resp, 201);

  expect(json.revisionNumber).toBe(3);

  // cannot reorder the following 2 statements
  // nor cannot use reloadEntities
  // why??
  await reloadEntity(prevLatestRev);
  await reloadEntity(article);

  const latestRevision = await article.latestRevision.load();

  expect(latestRevision.revisionNumber).toBe(3);
  expect(await article.revisions.loadCount(true)).toBe(3);
  expect(latestRevision.abstract).toBe(payload.abstract);
  expect(latestRevision.codeLink).toBe(payload.codeLink);

  expect(prevLatestRev.latestRevisionOf).toBeUndefined();

});
