import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import { ArticleRevision } from "../../src/entities/ArticleRevision";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { deleteArticleRoute } from "@/routes/article/delete";
import { User } from "@/entities/User";
import { expectCodeAndJson } from "tests/utils/assertions";
import { getAllFilesOfArticle } from "@/services/removeArticleFiles";
import { expectFile, removeUploadDir, touchFile } from "tests/utils/fs";

let server: FastifyInstance;

let users: MockUsers;
let articles: Article[];

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, 2, users);
});

afterEach(async () => {
  await removeUploadDir();
  await server.close();
});

it("delete the article and all revisions and files as admin", async () => {

  const article = articles[1];

  // create file
  const files = getAllFilesOfArticle(article);
  await Promise.all(files.map((x) => touchFile(x)));

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.adminUser);

  expectCodeAndJson(resp, 204);

  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(1);
  expect(await em.getRepository(ArticleRevision).count()).toBe(1);

  // Should not delete the user
  expect(await em.findOne(User, { id: article.owner.id })).not.toBeNull();

  // should delete all files
  await Promise.all(files.map((x) => expectFile(x, false)));

});

it("cannot delete the article and all revisions as non admin",  async () => {
  const article = articles[1];

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.normalUser2);

  expectCodeAndJson(resp, 403);

  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(2);
  expect(await em.getRepository(ArticleRevision).count()).toBe(3);
});

it("cannot delete non-existent article",  async () => {
  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: 12124 },
  }, users.adminUser);

  expectCodeAndJson(resp, 404);

});
