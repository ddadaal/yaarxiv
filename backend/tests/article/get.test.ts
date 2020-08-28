import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import * as getApi from "yaarxiv-api/article/get";
import { dropData, fillData } from "./utils/data";
import { EntityManager } from "@mikro-orm/core";

const articleCount = 12;


let server: FastifyInstance;
let em: EntityManager;

beforeEach(async () => {
  server = await startApp();

  em = await fillData(server, articleCount);
});

afterEach(async () => {
  await server.close();
  await dropData(server);
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
    query: { revision: "3" },
  });

  expect(resp.statusCode).toBe(404);
  expect(resp.json().notFound).toBe("revision");
});
