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
import { expectFile, removeUploadDir, touchFile } from "tests/utils/fs";
import { getArticleBasePath, getPathForArticleFile } from "@/utils/articleFiles";

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

function getFilesOfArticle(article: Article) {
  return article.revisions.getItems().map((x) => x.script.getEntity().filePath);
}

it("delete the article and all revisions and files as admin", async () => {

  const article = articles[1];

  // create file
  const files = getFilesOfArticle(article);
  await Promise.all(files.map((x) => touchFile(x)));

  // create file for another article
  const another = articles[0];
  const anotherFile = "another.test.pdf";


  await Promise.all(another.revisions.getItems().map(async (rev) => {
    const filePath = getPathForArticleFile(another, anotherFile);
    rev.script.getEntity().filePath = filePath;
    await touchFile(filePath);
  }));

  await server.orm.em.flush();

  const resp = await callRoute(server, deleteArticleRoute, {
    path: { articleId: article.id },
  }, users.adminUser);

  expectCodeAndJson(resp, 204);

  const em = server.orm.em.fork();
  expect(await em.getRepository(Article).count()).toBe(1);
  expect(await em.getRepository(ArticleRevision).count()).toBe(1);

  // Should not delete the user
  expect(await em.findOne(User, { id: article.owner.id })).not.toBeNull();

  // should delete all files of the article
  await Promise.all(files.map((x) => expectFile(x, false)));

  // should not delete files of another article
  await expectFile(getArticleBasePath(another), true);
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
