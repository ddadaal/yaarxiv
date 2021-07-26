import { FastifyInstance } from "fastify/types/instance";
import { UploadedFile } from "../../src/entities/UploadedFile";
import * as api from "yaarxiv-api/api/article/uploadPDF";
import { mockFileForm } from "./utils/mockFileForm";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { uploadPdfRoute } from "@/routes/article/uploadPdf";
import { expectCode, expectCodeAndJson } from "tests/utils/assertions";
import { expectFile, removeUploadDir } from "tests/utils/fs";

let server: FastifyInstance;
let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
});


afterEach(async () => {
  await server.close();
  await removeUploadDir();
});

it("upload an PDF to the system.", async () => {

  const fileSize = api.PDF_SIZE_LIMIT_MB * 1024 * 1024 - 100;
  const formData = mockFileForm(fileSize);

  const resp = await callRoute(server, uploadPdfRoute, {
    body: formData as any,
  }, users.normalUser1, formData.getHeaders());

  const { token } = expectCodeAndJson(resp, 201);

  const em = server.orm.em.fork();
  expect(await em.count(UploadedFile)).toBe(1);

  const upload = await em.findOneOrFail(UploadedFile, { id: token });
  expect(upload.user.id).toBe(users.normalUser1.id);

  // expect file
  const f = await expectFile(upload.filePath);
  expect(f.size).toBe(fileSize);
});

it("fails if the file size is too big.", async () => {
  const fileSize = api.PDF_SIZE_LIMIT_MB * 1024 * 1024 + 100;
  const formData = mockFileForm(fileSize);

  const resp = await callRoute(server, uploadPdfRoute, {
    body: formData as any,
  }, users.normalUser1, formData.getHeaders());

  expectCode(resp, 413);
});
