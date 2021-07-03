import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { deleteArticleRoute } from "@/routes/article/delete";
import { User } from "@/entities/User";
import { expectCode } from "tests/utils/assertions";

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

  expectCode(resp, 204);

  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(1);
  expect(await em.getRepository(ArticleRevision).count()).toBe(1);

  // Should not delete the user
  expect(await em.findOne(User, { id: article.owner.id })).not.toBeNull();
});

it("delete the article and all revisions as owner", async () => {
  const article = articles[0];

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.normalUser1);

  expectCode(resp, 204);
  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(1);
  expect(await em.getRepository(ArticleRevision).count()).toBe(2);

  // Should not delete the user
  expect(await em.findOne(User, { id: article.owner.id })).not.toBeNull();
});

it("cannot delete the article and all revisions as neither owner nor admin",  async () => {
  const article = articles[1];

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.normalUser1);

  expectCode(resp, 403);

  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(2);
  expect(await em.getRepository(ArticleRevision).count()).toBe(3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: 12124 },
  }, users.normalUser1);

  expectCode(resp, 404);

});
