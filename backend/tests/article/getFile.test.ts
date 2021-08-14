import { User } from "@/entities/User";
import { callRoute } from "@/utils/callRoute";
import { FastifyInstance } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { createFile } from "./utils/mockFileForm";
import { createMockArticles } from "./utils/generateArticles";
import { Article } from "@/entities/Article";
import { getArticleFileRoute } from "@/routes/article/getFile";
import { range } from "@/utils/array";
import { expectCode, expectCodeAndJson } from "tests/utils/assertions";
import { removeUploadDir } from "tests/utils/fs";
import { getPathForArticleFile } from "@/services/articleFiles";

let server: FastifyInstance;
let users: MockUsers;
let article: Article;


const pdfFilename = (i: number) => `test${i}.pdf`;
const pdfSize = (i: number) => (10+i)*1024*1024;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  article = (await createMockArticles(server, 2, users))[1];

  const revisions = article.revisions.getItems();

  // create the file for both revision

  await Promise.all(range(0, 2).map(async (i) => {

    const filename = pdfFilename(i);
    const size = pdfSize(i);

    const filePath = getPathForArticleFile(article, filename);
    revisions[i].script.getEntity().filePath = filePath;

    await createFile(size, filePath);
  }));

  await server.orm.em.flush();
});

afterEach(async () => {
  await server.close();
  await removeUploadDir();
});

it("returns file of latest revision", async () => {
  const resp = await callRoute(server, getArticleFileRoute, {
    path: { articleId: article.id },
    query: {},
  }, users.normalUser1);

  expectCode(resp, 200);
  expect(resp.headers["content-length"]).toBe(pdfSize(1));
  expect(resp.headers["content-type"]).toBe("application/pdf");
});

it("returns file of specific revision", async () => {
  const resp = await callRoute(server, getArticleFileRoute, {
    path: { articleId: article.id },
    query: { revision: 1 },
  }, users.normalUser1);

  expectCode(resp, 200);
  expect(resp.headers["content-length"]).toBe(pdfSize(0));
  expect(resp.headers["content-type"]).toBe("application/pdf");
});

it("returns 404 if article is not found", async () => {
  const resp = await callRoute(server, getArticleFileRoute, {
    path: { articleId: 12345 },
    query: {},
  }, users.normalUser1);

  const json = expectCodeAndJson(resp, 404);
  expect(json.notFound).toBe("article");
});

it("returns 404 if revision is not found", async () => {
  const resp = await callRoute(server, getArticleFileRoute, {
    path: { articleId: article.id },
    query: { revision: 3 },
  }, users.normalUser1);

  const json = expectCodeAndJson(resp, 404);
  expect(json.notFound).toBe("revision");
});

it("returns 403 if the article is retracted", async () => {

  article.retractTime = new Date();
  await server.orm.em.flush();

  const resp = await callRoute(server, getArticleFileRoute, {
    path: { articleId: article.id },
    query: { revision: 3 },
  }, users.normalUser1);

  expectCode(resp, 403);
});

it("returns file if article is not public but the user is either admin or owner", async () => {

  article.adminSetPublicity = false;
  await server.orm.em.flush();

  const test = async (user: User) => {
    const resp = await callRoute(server, getArticleFileRoute, {
      path: { articleId: article.id },
      query: {},
    }, user);

    expectCode(resp, 200);
  };

  await Promise.all([
    test(users.normalUser2),
    test(users.adminUser),
  ]);
});

it("returns 404 if article is not public and the user is neither admin nor owner", async () => {

  article.adminSetPublicity = false;
  await server.orm.em.flush();
  const resp = await callRoute(server, getArticleFileRoute, {
    path: { articleId: article.id },
    query: {},
  }, users.normalUser1);

  const json = expectCodeAndJson(resp, 404);
  expect(json.notFound).toBe("article");

});

// it("cannot download file from static folder", async () => {
//   const resp = await server.inject({
//     path: `/static/${article.owner.id}/${team.filename!}`,
//   });

//   expect(resp.statusCode).toBe(404);
// });
