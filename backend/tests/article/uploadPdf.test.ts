import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import { getRepository } from "typeorm";
import * as api from "yaarxiv-api/article/uploadPDF";
import { insertUserInfo, login, normalUser1 } from "./utils/login";
import { PdfUpload } from "../../src/entities/PdfUpload";
import fs from "fs";
import FormData from "form-data";
import { config } from "node-config-ts";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertUserInfo();
});

afterEach(async () => {
  await server.close();
  // delete the test upload path
  await fs.promises.rmdir(config.upload.path, { recursive: true });
});

function mockForm(size: number) {
  const formData = new FormData();
  formData.append("file", Buffer.alloc(size), {
    filename: "test.pdf",
    contentType: "application/pdf",
    knownLength: size,
  });
  return formData;
}

it("upload an PDF to the system.", async () => {

  const fileSize = 1* 1024*1024; // 1MB
  const formData = mockForm(fileSize);

  const resp = await server.inject({
    ...api.endpoint,
    payload: formData,
    ...login(server, normalUser1, formData.getHeaders()),
  });

  expect(resp.statusCode).toBe(201);
  const repo =  getRepository(PdfUpload);
  expect(await repo.count()).toBe(1);

  const token = resp.json().token;

  const upload = await repo.findOne(token);
  expect(upload).not.toBeUndefined();
  expect(upload!.userId).toBe(normalUser1.id);

});

it("fails if the file size is too big.", async () => {
  const fileSize = 10* 1024*1024; // 10MB
  const formData = mockForm(fileSize);

  const resp = await server.inject({
    ...api.endpoint,
    payload: formData,
    ...login(server, normalUser1, formData.getHeaders()),
  });

  expect(resp.statusCode).toBe(413);
});
