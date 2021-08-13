import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { expectCodeAndJson } from "tests/utils/assertions";
import { retractArticleRoute } from "@/routes/article/retract";

let server: FastifyInstance;

let users: MockUsers;
let articles: Article[];

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, 2, users);
});

afterEach(async () => {
  await server.close();
});


it("retracts the article as admin", async () => {

  const article = articles[1];

  const resp = await callRoute(server, retractArticleRoute, {
    path: { articleId: article.id },
    body: {},
  }, users.adminUser);

  expectCodeAndJson(resp, 204);

  await reloadEntity(article);
  expect(article.retractedBy?.id).toBe(users.adminUser.id);
  expect(article.retractTime).toBeDefined();
});

it("retracts the article as owner", async () => {

  const article = articles[1];

  const resp = await callRoute(server, retractArticleRoute, {
    path: { articleId: article.id },
    body: {},
  }, article.owner.getEntity());

  expectCodeAndJson(resp, 204);

  await reloadEntity(article);

  expect(article.retractedBy?.id).toBe(article.owner.id);
  expect(article.retractTime).toBeDefined();
});

it("cannot retract the article and all revisions as non admin or non owner",  async () => {
  const article = articles[1];

  const resp = await callRoute(server, retractArticleRoute, {
    path: { articleId: article.id },
    body: {},
  }, users.normalUser1);

  const { reason } = expectCodeAndJson(resp, 403);

  expect(reason).toBe("noAccess");

  await reloadEntity(article);
  expect(article.retractTime).toBeUndefined();
});

it("cannot retract non-existent article",  async () => {
  const resp = await callRoute(server, retractArticleRoute, {
    path: { articleId: 12314 },
    body: {},
  }, users.normalUser2);

  expectCodeAndJson(resp, 404);
});

it("cannot retract already retracted article",  async () => {

  const article = articles[1];
  article.retractTime = new Date();
  await server.orm.em.flush();

  const resp = await callRoute(server, retractArticleRoute, {
    path: { articleId: article.id },
    body: {},
  }, users.normalUser2);

  const { reason } = expectCodeAndJson(resp, 403);

  expect(reason).toBe("retracted");
});
