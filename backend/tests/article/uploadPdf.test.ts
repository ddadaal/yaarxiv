import { FastifyInstance } from "fastify/types/instance";
import { PdfUpload } from "../../src/entities/PdfUpload";
import fs from "fs";
import { mockFileForm } from "./utils/mockFileForm";
import { config } from "@/utils/config";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { createMockArticles } from "./utils/data";
import { callRoute } from "@/utils/callRoute";
import { uploadPdfRoute } from "@/routes/article/uploadPdf";

let server: FastifyInstance;
let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  await createMockArticles(server, 12, users);
});


afterEach(async () => {
  await server.close();
  // delete the test upload path
  await fs.promises.rmdir(config.upload.path, { recursive: true });
});

it("upload an PDF to the system.", async () => {

  const fileSize = 1* 1024*1024; // 1MB
  const formData = mockFileForm(fileSize);

  const resp = await callRoute(server, uploadPdfRoute, {
    body: formData as any,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(201);

  const em = server.orm.em.fork();
  expect(await em.count(PdfUpload)).toBe(1);

  const token = resp.json<201>().token;

  const upload = await em.findOneOrFail(PdfUpload, { id: token });
  expect(upload.user.id).toBe(users.normalUser1.id);

});

it("fails if the file size is too big.", async () => {
  const fileSize = 10* 1024*1024; // 10MB
  const formData = mockFileForm(fileSize);

  const resp = await callRoute(server, uploadPdfRoute, {
    body: formData as any,
  }, users.normalUser1);

  expect(resp.statusCode).toBe(413);
});
