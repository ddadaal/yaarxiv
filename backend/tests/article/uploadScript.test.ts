import { FastifyInstance } from "fastify/types/instance";
import { UploadedFile } from "../../src/entities/UploadedFile";
import * as api from "yaarxiv-api/api/article/uploadScript";
import { mockFileForm } from "./utils/mockFileForm";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { uploadScriptRoute } from "@/routes/article/uploadScript";
import { expectCode, expectCodeAndJson } from "tests/utils/assertions";
import { expectFile, removeUploadDir } from "tests/utils/fs";
import MockDate from "mockdate";

let server: FastifyInstance;
let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
});


afterEach(async () => {
  MockDate.reset();
  await server.close();
  await removeUploadDir();
});

it("upload a file to the system.", async () => {

  const now = new Date();

  MockDate.set(now);

  const fileSize = api.SCRIPT_SIZE_LIMIT_MB * 1024 * 1024 - 100;
  const formData = mockFileForm(fileSize);

  const resp = await callRoute(server, uploadScriptRoute, {
    body: formData as any,
  }, users.normalUser1, formData.getHeaders());

  const { token } = expectCodeAndJson(resp, 201);

  const em = server.orm.em.fork();
  expect(await em.count(UploadedFile)).toBe(1);

  const upload = await em.findOneOrFail(UploadedFile, { id: token });
  expect(upload.user.id).toBe(users.normalUser1.id);

  // expect file
  const f = await expectFile(upload.filePath, true);
  expect(f.size).toBe(fileSize);

  expect(upload.time).toEqual(now);
});

it("checks for format", async () => {

  const test = async (filename: string, success: boolean) => {
    const fileSize = api.SCRIPT_SIZE_LIMIT_MB * 1024 * 1024 - 100;
    const formData = mockFileForm(fileSize, filename);

    const resp = await callRoute(server, uploadScriptRoute, {
      body: formData as any,
    }, users.normalUser1, formData.getHeaders());

    if (success) {
      expectCode(resp, 201, filename);
    } else {
      const json = expectCodeAndJson(resp, 400, filename) as any;
      expect(json.code).toBe("YAARXIV_SCRIPT_FORMAT_ERROR");
    }
  };

  await Promise.all([
    test("test.pdf", true),
    test("test.txt", true),
    test("test.doc", true),
    test("test.docx", true),
    test("test.mp4", false),
    test("test.mp3", false),
  ]);



});

it("fails if the file size is too big.", async () => {
  const fileSize = api.SCRIPT_SIZE_LIMIT_MB * 1024 * 1024 + 100;
  const formData = mockFileForm(fileSize);

  const resp = await callRoute(server, uploadScriptRoute, {
    body: formData as any,
  }, users.normalUser1, formData.getHeaders());

  expectCode(resp, 413);
});
