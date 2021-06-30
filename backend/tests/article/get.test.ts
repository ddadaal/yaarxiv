import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as getApi from "yaarxiv-api/article/get";
import { createMockArticles } from "./utils/data";
import { Article } from "@/entities/Article";
import { getRepository } from "typeorm";
import { replacePathInEndpoint } from "tests/utils/replacePathInEndpoint";
import { adminUser, login, normalUser1 } from "./utils/login";

const articleCount = 12;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await createMockArticles(articleCount);
});

afterEach(async () => {
  await server.close();
});

it("should return 404 if article doesn't exist", async () => {
  const resp = await server.inject({
    method: getApi.endpoint.method,
    url: "/articles/15",
  });

  expect(resp.statusCode).toBe(404);
  expect(resp.json().notFound).toBe("article");
});

it("should return the latest revision of article if revision is not specified", async () => {
  const resp = await server.inject({
    method: getApi.endpoint.method,
    url: "/articles/2",
  });

  expect(resp.statusCode).toBe(200);

  const { article } = resp.json() as getApi.GetArticleSchema["responses"]["200"];

  expect(article.id).toBe("2");
  expect(article.revisionNumber).toBe(2);
});

it("should return the specified revision of article if specified", async () => {
  const resp = await server.inject({
    method: getApi.endpoint.method,
    url: "/articles/2",
    query: { revision: "1" },
  });

  expect(resp.statusCode).toBe(200);

  const { article } = resp.json() as getApi.GetArticleSchema["responses"]["200"];

  expect(article.id).toBe("2");
  expect(article.revisionNumber).toBe(1);
});


it("shoud return 404 if revision is not found.", async () => {
  const resp = await server.inject({
    method: getApi.endpoint.method,
    url: "/articles/2",
    query: { revision: "5" },
  });

  expect(resp.statusCode).toBe(404);
  expect(resp.json().notFound).toBe("revision");
});

async function changeArticleToPrivate(articleId: number, property: "admin" | "owner") {
  const id = 1;
  const repo = getRepository(Article);
  const article = await repo.findOne(id);
  if (!article) {
    fail(`Article ${id} does not exist`);
  }
  if (property === "admin") {
    article.adminSetPublicity = false;
  } else {
    article.ownerSetPublicity = false;
  }
  await repo.save(article);
}

it("should return 404 for admin set private articles", async () => {
  const id = 1;
  await changeArticleToPrivate(id, "admin");

  const resp = await server.inject({
    ...replacePathInEndpoint(getApi.endpoint, { articleId: id }),
  });

  expect(resp.statusCode).toBe(404);
  expect(resp.json().notFound).toBe("article");

});

it("should return 404 for owner set private articles", async () => {
  const id = 1;
  await changeArticleToPrivate(id, "owner");

  const resp = await server.inject({
    ...replacePathInEndpoint(getApi.endpoint, { articleId: id }),
  });

  expect(resp.statusCode).toBe(404);
  expect(resp.json().notFound).toBe("article");

});

it("return the private article if the logged in user is the owner", async () => {
  const id = 1;
  await changeArticleToPrivate(id, "owner");

  const resp = await server.inject({
    ...replacePathInEndpoint(getApi.endpoint, { articleId: id }),
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
});

it("return the private article if the logged in user is admin", async () => {
  const id = 1;
  await changeArticleToPrivate(id, "owner");

  const resp = await server.inject({
    ...replacePathInEndpoint(getApi.endpoint, { articleId: id }),
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
});
