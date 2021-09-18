import { FastifyInstance } from "fastify/types/instance";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { Article } from "@/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute, CallRouteResponse } from "@/utils/callRoute";
import { expectCodeAndJson, expectErrorResponse } from "tests/utils/assertions";
import { getArticleScriptDownloadTokenRoute, GET_ARTICLE_SCRIPT_ACTION } from "@/routes/article/getScriptDownloadToken";
import { ArticleId } from "yaarxiv-api/api/article/models";
import { GetArticleScriptDownloadTokenSchema } from "yaarxiv-api/api/article/getScriptDownloadToken";

const articleCount = 12;

let server: FastifyInstance;
let users: MockUsers;
let articles: Article[];

async function changeArticleToPrivate(property: "admin" | "owner") {
  const article = articles[0];
  if (property === "admin") {
    article.adminSetPublicity = false;
  } else {
    article.ownerSetPublicity = false;
  }
  await server.orm.em.flush();
  return article;
}

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, articleCount, users);
});

afterEach(async () => {
  await server.close();
});

const validateToken = async (resp: CallRouteResponse<GetArticleScriptDownloadTokenSchema>, articleId: ArticleId) => {
  const json = expectCodeAndJson(resp, 200);

  const payload = await server.accessToken.validate<{ articleId: number }>(GET_ARTICLE_SCRIPT_ACTION, json.token);

  expect(payload?.articleId).toBe(articleId);
};

it("returns script download token for public article without login", async () => {

  const articleId = 2;

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId },
  });

  await validateToken(resp, articleId);
});

it("rejects if article does not exist", async () => {
  const articleId = 200;

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId },
  });

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("rejects if article is private and the user is not login", async () => {
  const article = await changeArticleToPrivate("admin");

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId: article.id },
  });

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("rejects if article is private and the user is neither admin nor author", async () => {
  const article = await changeArticleToPrivate("admin");

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId: article.id },
  }, users.normalUser2);

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("rejects if article is retracted", async () => {
  const article = articles[0];
  article.retractTime = new Date();
  await server.orm.em.flush();

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId: article.id },
  }, users.normalUser2);

  expectErrorResponse(resp, 403, "ARTICLE_RETRACTED");
});

it("generates token if article is private but the user is author", async () => {

  const article = await changeArticleToPrivate("admin");

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId: article.id },
  }, article.owner.getEntity());

  await validateToken(resp, article.id);
});

it("generats if the article is private but the user is admin", async () => {

  const article = await changeArticleToPrivate("admin");

  const resp = await callRoute(server, getArticleScriptDownloadTokenRoute, {
    path: { articleId: article.id },
  }, users.adminUser);

  await validateToken(resp, article.id);
});
