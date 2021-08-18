import { FastifyInstance } from "fastify/types/instance";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { Article } from "@/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { getArticleRoute } from "@/routes/article/get";
import { expectCodeAndJson, expectErrorResponse } from "tests/utils/assertions";

const articleCount = 12;

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

it("should return 404 if article doesn't exist", async () => {
  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: 100 },
    query: {},
  });

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("should return the latest revision of article if revision is not specified", async () => {
  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: 2 },
    query: {},
  });

  const { article } = expectCodeAndJson(resp, 200);

  expect(article.id).toBe(2);
  expect(article.revisionNumber).toBe(2);
});

it("should return the specified revision of article if specified", async () => {
  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: 2 },
    query: { revision: 1 },
  });

  const { article } = expectCodeAndJson(resp, 200);

  expect(article.id).toBe(2);
  expect(article.revisionNumber).toBe(1);
});


it("shoud return 404 if revision is not found.", async () => {
  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: 2 },
    query: { revision: 5 },
  });

  expectErrorResponse(resp, 404, "REVISION_NOT_FOUND");
});

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

it("should return 404 for admin set private articles", async () => {
  const article = await changeArticleToPrivate("admin");

  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: article.id },
    query: {},
  });

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("should return 404 for owner set private articles", async () => {
  const article = await changeArticleToPrivate("owner");

  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: article.id },
    query: {},
  });

  expectErrorResponse(resp, 404, "ARTICLE_NOT_FOUND");
});

it("return the private article if the logged in user is the owner", async () => {
  const article = await changeArticleToPrivate("owner");

  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: article.id },
    query: {},
  }, users.normalUser1);

  expectCodeAndJson(resp, 200);
});

it("return the private article if the logged in user is admin", async () => {
  const article = await changeArticleToPrivate("owner");

  const resp = await callRoute(server, getArticleRoute, {
    path: { articleId: article.id },
    query: {},
  }, users.adminUser);

  expectCodeAndJson(resp, 200);
});
