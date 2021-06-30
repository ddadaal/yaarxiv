import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { createMockArticles } from "./utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { deleteArticleRoute } from "@/routes/article/delete";

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


it("delete the article and all revisions as admin", async () => {

  const article = articles[1];

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.adminUser);

  expect(resp.statusCode).toBe(204);
  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(1);
  expect(await em.getRepository(ArticleRevision).count()).toBe(1);
});

it("delete the article and all revisions as owner", async () => {
  const article = articles[0];

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(204);
  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(1);
  expect(await em.getRepository(ArticleRevision).count()).toBe(2);
});

it("cannot delete the article and all revisions as neither owner nor admin",  async () => {
  const article = articles[1];

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(403);

  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(2);
  expect(await em.getRepository(ArticleRevision).count()).toBe(3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: 12124 },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(404);

});
