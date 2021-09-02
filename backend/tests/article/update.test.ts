import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import * as api from "yaarxiv-api/api/article/update";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute"; import { updateArticleRoute } from "@/routes/article/update";
import { expectCode, expectCodeAndJson, expectErrorResponse } from "tests/utils/assertions";
import { articleInfoI18nConstraintsFailedCases, ArticleInfoI18nPart } from "yaarxiv-api/api/article/models";
import { expectFile, touchFile } from "tests/utils/storage";
import { UploadedFile } from "@/entities/UploadedFile";
import { getPathForArticleFile } from "@/utils/articleFiles";
import MockDate from "mockdate";

const articleCount = 2;

let server: FastifyInstance;
let users: MockUsers;
let articles: Article[];

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  articles = await createMockArticles(server, articleCount, users);
});

afterEach(async () => {
  MockDate.reset();
  await server.close();
});

const payload: api.UpdateArticleSchema["body"] = {
  abstract: "123",
  cnKeywords: ["k1", "k2"],
  codeLink: "https://github.com/test/test",
  authors: [{ name: "author", affiliation: "test", correspondingAuthor: false }],
  cnTitle: "123",
};

it("should reject bad code link", async () => {
  // bad code link
  const badPayload = {
    ...payload,
    codeLink: "https://github.com/test",
  };

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: 1 },
    body: badPayload,
  }, users.normalUser1);

  expectCodeAndJson(resp, 400);
});

it("return 403 if not the owner.", async () => {

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: 1 },
    body: payload,
  }, users.normalUser2);

  expectErrorResponse(resp, 403, "NOT_AUTHOR");
});

it("return 403 if retracted.", async () => {

  const article = articles[0];
  article.retractTime = new Date();
  await server.orm.em.flush();

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: article.id },
    body: payload,
  }, article.owner.getEntity());

  expectErrorResponse(resp, 403, "ARTICLE_RETRACTED");
});

it("update an article with pdf", async () => {
  const now = new Date();
  MockDate.set(now);


  const article = articles[1];
  const prevLatestRev = article.latestRevision.getEntity();

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: article.id },
    body: payload,
  }, users.normalUser2);

  const json = expectCodeAndJson(resp, 201);

  expect(json.revisionNumber).toBe(3);

  // cannot reorder the following 2 statements
  // nor cannot use reloadEntities
  // why??
  await reloadEntity(prevLatestRev);
  await reloadEntity(article);

  const latestRevision = await article.latestRevision.load();

  expect(latestRevision.revisionNumber).toBe(3);
  expect(await article.revisions.loadCount(true)).toBe(3);
  expect(latestRevision.abstract).toBe(payload.abstract);
  expect(latestRevision.codeLink).toBe(payload.codeLink);
  expect(article.lastUpdateTime).toEqual(now);

  expect(prevLatestRev.latestRevisionOf).toBeUndefined();

  // expect the file to be equal
  expect(prevLatestRev.script.id).toBe(latestRevision.script.id);
});

it("updates file info", async () => {

  // create and upload a file
  const user = users.normalUser2;
  const filename = "test2.pdf";

  const pdf = new UploadedFile({ user, filePath: `${user.id}/temp/${filename}`, time: new Date() });
  await server.orm.em.persistAndFlush(pdf);

  await touchFile(pdf.filePath);

  const article = articles[1];
  const prevLatestRev = article.latestRevision.getEntity();

  const resp = await callRoute(server, updateArticleRoute, {
    path: { articleId: article.id },
    body: { ...payload, pdfToken: pdf.id },
  }, user);

  const json = expectCodeAndJson(resp, 201);

  expect(json.revisionNumber).toBe(3);

  await reloadEntity(prevLatestRev);
  await reloadEntity(article);
  await reloadEntity(pdf);

  const latestRevision = await article.latestRevision.load();

  expect(latestRevision.revisionNumber).toBe(3);
  expect(await article.revisions.loadCount(true)).toBe(3);
  expect(latestRevision.abstract).toBe(payload.abstract);
  expect(latestRevision.codeLink).toBe(payload.codeLink);

  expect(prevLatestRev.latestRevisionOf).toBeUndefined();

  expect(prevLatestRev.script.id).not.toBe(latestRevision.script.id);
  expect(latestRevision.script.id).toBe(pdf.id);
  expect(prevLatestRev.script.getEntity().filePath).not.toBe(pdf.filePath);
  expect(pdf.filePath).toBe(getPathForArticleFile(article, filename));
  await expectFile(`${user.id}/temp/${filename}`, false);
  await expectFile(getPathForArticleFile(article, filename), true);

});

it("rejects bad title and keywords input", async () => {

  const { cnTitle: _, cnKeywords: __, ...rest } = payload;

  const test = async (info: ArticleInfoI18nPart) => {
    const resp = await callRoute(server, updateArticleRoute, {
      path: { articleId: 1 },
      body: { ...rest, ...info },
    }, users.normalUser1);

    expectCode(resp, 400, JSON.stringify(info));
  };

  await Promise.all(articleInfoI18nConstraintsFailedCases.map(test));
});
