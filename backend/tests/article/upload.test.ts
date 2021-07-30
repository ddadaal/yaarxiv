import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { Reference } from "@mikro-orm/core";
import { callRoute } from "@/utils/callRoute";
import { uploadArticleRoute } from "@/routes/article/upload";
import { createMockArticles, generatePdf } from "./utils/generateArticles";
import { expectCodeAndJson } from "tests/utils/assertions";

const articleCount = 12;

let server: FastifyInstance;
let users: MockUsers;
let pdfId: number;
let payload;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  await createMockArticles(server, articleCount, users);

  pdfId = await insertPdf();

  payload = {
    abstract: "123",
    authors: [{ name: "author" }],
    cnKeywords: ["k1", "k2"],
    cnTitle: "123",
    pdfToken: pdfId,
    codeLink: "https://github.com/test/test",
  };
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

  const resp = await callRoute(server, uploadArticleRoute, {
    body: payload,
  }, users.normalUser1);

  expectCodeAndJson(resp, 201);

  const em = server.orm.em.fork();

  expect(await em.count(Article)).toBe(articleCount+1);

  const article = await em.findOneOrFail(Article, {
    id: resp.json<201>().id,
  }, { populate: [ "revisions", "latestRevision" ]});

  const rev = article.latestRevision.get();
  expect(rev.abstract).toBe(payload.abstract);
  expect(rev.cnTitle).toBe(payload.cnTitle);
  expect(rev.cnKeywords).toEqual(payload.cnKeywords);
  expect(rev.codeLink).toBe(payload.codeLink);
});

it("fails if pdf token is invalid.", async () => {
  const resp = await callRoute(server, uploadArticleRoute, {
    body: { ...payload, pdfToken: 12312431451 },
  }, users.normalUser1);

  expectCodeAndJson(resp, 400);
});

it("fails if the title is too long", async () => {
  const resp = await callRoute(server, uploadArticleRoute, {
    body: { ...payload, cnTitle: "a".repeat(120) },
  }, users.normalUser1);

  expectCodeAndJson(resp, 400);
});

it("fails if code link is bad", async () => {
  const resp = await callRoute(server, uploadArticleRoute, {
    body: { ...payload, codeLink: "https://github.com/ddadaal" },
  }, users.normalUser1);

  expectCodeAndJson(resp, 400);
});
