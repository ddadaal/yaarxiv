import { User } from "@/entities/User";
import { callRoute } from "@/utils/callRoute";
import { FastifyInstance } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { createMockArticles } from "./utils/generateArticles";
import { Article } from "@/entities/Article";
import { getArticleScriptRoute } from "@/routes/article/getScript";
import { range } from "@/utils/array";
import { expectCode, expectErrorResponse } from "tests/utils/assertions";
import { removeUploadDir, touchFile } from "tests/utils/storage";
import { getPathForArticleFile } from "@/utils/articleFiles";
import { signUser } from "@/plugins/auth";
import { ArticleId } from "yaarxiv-api/api/article/models";
import {
  GET_ARTICLE_SCRIPT_ACTION, GET_ARTICLE_SCRIPT_TOKEN_VALID_TIME } from "@/routes/article/getScriptDownloadToken";

let server: FastifyInstance;
let users: MockUsers;
let articles: Article[];
let article: Article;
let token: string;


const pdfFilename = (i: number) => `test${i}.pdf`;
const pdfSize = (i: number) => (10+i)*1024*1024;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);

  articles = (await createMockArticles(server, 2, users));
  article = articles[1];

  token = generateToken(server, article.id);

  const revisions = article.revisions.getItems();

  // create the file for both revision

  await Promise.all(range(0, 2).map(async (i) => {

    const filename = pdfFilename(i);
    const size = pdfSize(i);

    const filePath = getPathForArticleFile(article, filename);
    revisions[i].script.getEntity().filePath = filePath;

    await touchFile(filePath, Buffer.alloc(size, "0"));
  }));

  await server.orm.em.flush();
});

afterEach(async () => {
  await server.close();
  await removeUploadDir();
});

function generateToken(fastify: FastifyInstance, articleId: ArticleId) {
  return fastify.ac.generate(
    GET_ARTICLE_SCRIPT_ACTION, { articleId }, GET_ARTICLE_SCRIPT_TOKEN_VALID_TIME).token;
}

it("returns file of latest revision", async () => {
  const resp = await callRoute(server, getArticleScriptRoute, {
    path: { articleId: article.id },
    query: { token },
  });

  expectCode(resp, 200);
  expect(resp.headers["content-length"]).toBe(pdfSize(1));
  expect(resp.headers["content-type"]).toBe("application/pdf");
});

it("returns file of specific revision", async () => {
  const resp = await callRoute(server, getArticleScriptRoute, {
    path: { articleId: article.id },
    query: { revision: 1, token },
  });

  expectCode(resp, 200);
  expect(resp.headers["content-length"]).toBe(pdfSize(0));
  expect(resp.headers["content-type"]).toBe("application/pdf");
});

// it("returns file if the article is public even if not login", async () => {
//   const resp = await callRoute(server, getArticleScriptRoute, {
//     path: { articleId: article.id },
//     query: {},
//   });

//   expectCode(resp, 200);
//   expect(resp.headers["content-length"]).toBe(pdfSize(1));
//   expect(resp.headers["content-type"]).toBe("application/pdf");
// });

it("returns 404 if article is not found", async () => {
  const resp = await callRoute(server, getArticleScriptRoute, {
    path: { articleId: 12345 },
    query: { token: generateToken(server, 1234) },
  });

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("returns 404 if revision is not found", async () => {
  const resp = await callRoute(server, getArticleScriptRoute, {
    path: { articleId: article.id },
    query: { revision: 3, token },
  });

  expectErrorResponse(resp, 404, "REVISION_NOT_FOUND");
});

it("returns 403 if the article is retracted", async () => {

  article.retractTime = new Date();
  await server.orm.em.flush();

  const resp = await callRoute(server, getArticleScriptRoute, {
    path: { articleId: article.id },
    query: { revision: 3, token },
  });

  expectCode(resp, 403);
});

it("returns file if article is not public but the token is valid", async () => {

  article.adminSetPublicity = false;
  await server.orm.em.flush();

  const resp = await callRoute(server, getArticleScriptRoute, {
    path: { articleId: article.id },
    query: { token: token },
  });

  expectCode(resp, 200);
});

// it("returns 404 if article is not public and the token is for another article", async () => {

//   article.adminSetPublicity = false;
//   await server.orm.em.flush();

//   const resp = await callRoute(server, getArticleScriptRoute, {
//     path: { articleId: article.id },
//     query: { token: generateToken(server, articles[0].id) },
//   });

//   expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
// });

// it("returns 404 if the article is not public and the user is not login", async () => {
//   article.adminSetPublicity = false;
//   await server.orm.em.flush();

//   const resp = await callRoute(server, getArticleScriptRoute, {
//     path: { articleId: article.id },
//     query: {},
//   });

//   expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
// });

// it("cannot download file from static folder", async () => {
//   const resp = await server.inject({
//     path: `/static/${article.owner.id}/${team.filename!}`,
//   });

//   expect(resp.statusCode).toBe(404);
// });
