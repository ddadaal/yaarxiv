import { FastifyInstance } from "fastify/types/instance";
import { createMockArticles } from "tests/article/utils/data";
import { Article } from "@/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { changeArticleOwnerSetPublicityRoute } from "@/routes/dashboard/changeArticlePublicity";

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

it("change the ower set publicity of an article", async () => {

  const article = articles[0];

  expect(article.adminSetPublicity).toBe(true);
  expect(article.ownerSetPublicity).toBe(true);


  const resp = await callRoute(server, changeArticleOwnerSetPublicityRoute, {
    path: { articleId: article.id },
    body: { publicity: false },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(200);
  const data = resp.json<200>();

  expect(data.publicity).toBe(false);

  await reloadEntity(article);

  expect(article.adminSetPublicity).toBe(true);
  expect(article.ownerSetPublicity).toBe(false);
});

it("return 403 if the logged in user is not the owner", async () => {

  const article = articles[0];

  const resp = await callRoute(server, changeArticleOwnerSetPublicityRoute, {
    path: { articleId: article.id },
    body: { publicity: false },
  }, users.normalUser2);

  expect(resp.statusCode).toBe(403);
});

it("return 403 if the logged in user is an admin", async () => {

  const article = articles[0];

  const resp = await callRoute(server, changeArticleOwnerSetPublicityRoute, {
    path: { articleId: article.id },
    body: { publicity: false },
  }, users.adminUser);

  expect(resp.statusCode).toBe(403);
});

it("return 404 if article does not exist", async () => {

  const resp = await callRoute(server, changeArticleOwnerSetPublicityRoute, {
    path: { articleId: 23295 },
    body: { publicity: false },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(404);
});
