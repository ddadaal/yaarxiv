import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import * as api from "yaarxiv-api/article/upload";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { Reference } from "@mikro-orm/core";
import { callRoute } from "@/utils/callRoute";
import { uploadArticleRoute } from "@/routes/article/upload";
import { createMockArticles, generatePdf } from "./utils/generateArticles";

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

async function insertPdf() {
  const pdf = generatePdf(Reference.create(users.normalUser1));
  await server.orm.em.persistAndFlush(pdf);
  return pdf.id;
}

it("upload an article.", async () => {

  // upload a pdf and get token

  const id = await insertPdf();

  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: id,
    title: "123",
    codeLink: "https://github.com/test/test",
  };

  const resp = await callRoute(server, uploadArticleRoute, {
    body: payload,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(201);

  const em = server.orm.em.fork();

  expect(await em.count(Article)).toBe(articleCount+1);

  const article = await em.findOneOrFail(Article, {
    id: resp.json<201>().id,
  }, { populate: [ "revisions", "latestRevision" ]});

  const rev = article.latestRevision.get();
  expect(rev.abstract).toBe(payload.abstract);
  expect(rev.title).toBe(payload.title);
  expect(rev.codeLink).toBe(payload.codeLink);
});

it("fails if pdf token is invalid.", async () => {
  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: 12315125,
    title: "123",
  };

  const resp = await callRoute(server, uploadArticleRoute, {
    body: payload,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(400);
});

it("fails if the title is too long", async () => {
  const id = await insertPdf();

  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: id,
    title: "a".repeat(120), // the limit is 100
  };

  const resp = await callRoute(server, uploadArticleRoute, {
    body: payload,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(400);
});

it("fails if code link is bad", async () => {
  // upload a pdf and get token
  const id = await insertPdf();

  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: id,
    title: "a".repeat(120), // the limit is 100
    codeLink: "https://github.com/ddadaal",
  };

  const resp = await callRoute(server, uploadArticleRoute, {
    body: payload,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(400);
});
