import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { Article } from "../../src/entities/Article";
import { getRepository } from "typeorm";
import * as api from "yaarxiv-api/article/upload";
import { login, normalUser1 } from "./utils/login";
import { PdfUpload } from "../../src/entities/PdfUpload";
import { generatePdf, insertData } from "./utils/data";

const articleCount = 12;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertData(articleCount);
});

afterEach(async () => {
  await server.close();
});


it("upload an article.", async () => {

  // upload a pdf and get token
  const pdfRepo = getRepository(PdfUpload);
  const pdf = generatePdf(normalUser1);
  await pdfRepo.save(pdf);

  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: pdf.id,
    title: "123",
    codeLink: "https://github.com/test/test",
  };

  const resp = await server.inject({
    ...api.endpoint,
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(201);
  const repo =  getRepository(Article);
  expect(await repo.count()).toBe(articleCount+1);

  const article = await repo.findOne(resp.json().id, { relations: [ "revisions" ]});
  if (!article) { fail("Article is undefined."); }
  expect(article.latestRevisionNumber).toBe(1);
  expect(article.revisions[0].abstract).toBe(payload.abstract);
  expect(article.revisions[0].title).toBe(payload.title);
  expect(article.revisions[0].codeLink).toBe(payload.codeLink);
});

it("fails if pdf token is invalid.", async () => {
  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: "12112ifjinaso",
    title: "123",
  };

  const resp = await server.inject({
    ...api.endpoint,
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(400);
});

it("fails if the title is too long", async () => {
  // upload a pdf and get token
  const pdfRepo = getRepository(PdfUpload);
  const pdf = generatePdf(normalUser1);
  await pdfRepo.save(pdf);

  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: pdf.id,
    title: "a".repeat(120), // the limit is 100
  };

  const resp = await server.inject({
    ...api.endpoint,
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(400);
});

it("fails if code link is bad", async () => {
  // upload a pdf and get token
  const pdfRepo = getRepository(PdfUpload);
  const pdf = generatePdf(normalUser1);
  await pdfRepo.save(pdf);

  const payload: api.UploadArticleSchema["body"] = {
    abstract: "123",
    authors: ["author"],
    keywords: ["k1", "k2"],
    pdfToken: pdf.id,
    title: "a".repeat(120), // the limit is 100
    codeLink: "https://github.com/ddadaal",
  };

  const resp = await server.inject({
    ...api.endpoint,
    payload,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(400);
});
