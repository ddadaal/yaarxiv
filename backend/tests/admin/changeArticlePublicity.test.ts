import { FastifyInstance } from "fastify/types/instance";
import { Article } from "@/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { changeArticleAdminSetPublicityRoute } from "@/routes/admin/changeArticlePublicity";
import { createMockArticles } from "tests/article/utils/generateArticles";

const articleCount = 3;

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

it("change the admin set publicity of an article", async () => {

  const article = articles[0];

  expect(article.adminSetPublicity).toBe(true);
  expect(article.ownerSetPublicity).toBe(true);

  const resp = await callRoute(server, changeArticleAdminSetPublicityRoute, {
    path: { articleId: article.id },
    body: { publicity: false },
  }, users.adminUser);

  expect(resp.statusCode).toBe(200);

  expect(resp.json<200>().publicity).toBe(false);

  await reloadEntity(article);

  expect(article.adminSetPublicity).toBe(false);
  expect(article.ownerSetPublicity).toBe(true);

});

it("return 403 if the logged in user is not admin", async () => {

  const article = articles[0];

  const resp = await callRoute(server, changeArticleAdminSetPublicityRoute, {
    path: { articleId: article.id },
    body: { publicity: false },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(403);
});

it("return 404 if article does not exist", async () => {

  const resp = await callRoute(server, changeArticleAdminSetPublicityRoute, {
    path: { articleId: 123124 },
    body: { publicity: false },
  }, users.adminUser);

  expect(resp.statusCode).toBe(404);
});
