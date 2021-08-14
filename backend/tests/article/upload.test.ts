import { FastifyInstance } from "fastify/types/instance";
import { Article } from "../../src/entities/Article";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { uploadArticleRoute } from "@/routes/article/upload";
import { createMockArticles } from "./utils/generateArticles";
import { expectCode, expectCodeAndJson } from "tests/utils/assertions";
import { ArticleInfoI18nPart } from "yaarxiv-api/api/article/models";
import { articleInfoI18nConstraintsFailedCases } from "yaarxiv-api/api/article/models";
import { UploadArticleSchema } from "yaarxiv-api/api/article/upload";
import { UploadedFile } from "@/entities/UploadedFile";
import { expectFile, touchFile } from "tests/utils/fs";
import { User } from "@/entities/User";
import { getPathForArticleFile } from "@/utils/articleFiles";

const articleCount = 12;

let server: FastifyInstance;
let users: MockUsers;
let user: User;
let pdfId: number;
let payload: UploadArticleSchema["body"];

const filename = "test.pdf";

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  await createMockArticles(server, articleCount, users);

  user = users.normalUser1;

  pdfId = await insertPdf();

  payload = {
    abstract: "123",
    authors: [{ name: "author", affiliation: "!23", correspondingAuthor: true }],
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
  const pdf = new UploadedFile({ user, filePath: `${user.id}/temp/${filename}`, time: new Date() });
  await server.orm.em.persistAndFlush(pdf);

  await touchFile(pdf.filePath);

  return pdf.id;
}


it("upload an article.", async () => {

  const resp = await callRoute(server, uploadArticleRoute, {
    body: payload,
  }, user);

  const { id } = expectCodeAndJson(resp, 201);

  const em = server.orm.em.fork();

  expect(await em.count(Article)).toBe(articleCount+1);

  const article = await em.findOneOrFail(Article, {
    id,
  }, { populate: [ "revisions", "latestRevision.script" ]});

  const rev = article.latestRevision.getEntity();
  expect(rev.abstract).toBe(payload.abstract);
  expect(rev.cnTitle).toBe(payload.cnTitle);
  expect(rev.cnKeywords).toEqual(payload.cnKeywords);
  expect(rev.codeLink).toBe(payload.codeLink);

  const scriptFilePath = getPathForArticleFile(article, filename);
  expect(rev.script.getEntity().filePath).toBe(scriptFilePath);

  await expectFile(`${user.id}/temp/${filename}`, false);
  await expectFile(scriptFilePath, true);
});

it("fails if pdf token is invalid.", async () => {
  const resp = await callRoute(server, uploadArticleRoute, {
    body: { ...payload, pdfToken: 12312431451 },
  }, user);

  expectCodeAndJson(resp, 400);
});

it("fails if the title is too long", async () => {
  const resp = await callRoute(server, uploadArticleRoute, {
    body: { ...payload, cnTitle: "a".repeat(120) },
  }, user);

  expectCodeAndJson(resp, 400);
});

it("fails if code link is bad", async () => {
  const resp = await callRoute(server, uploadArticleRoute, {
    body: { ...payload, codeLink: "https://github.com/ddadaal" },
  }, user);

  expectCodeAndJson(resp, 400);
});

it("rejects bad title and keywords input", async () => {

  const { cnTitle, cnKeywords, ...rest } = payload;

  const test = async (info: ArticleInfoI18nPart) => {
    const resp = await callRoute(server, uploadArticleRoute, {
      body: { ...rest, ...info },
    }, user);

    expectCode(resp, 400, JSON.stringify(info));
  };

  await Promise.all(articleInfoI18nConstraintsFailedCases.map(test));
});
