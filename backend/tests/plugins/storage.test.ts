import { FastifyInstance } from "fastify/types/instance";
import { InjectOptions, RouteHandlerMethod } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { mockFileForm } from "tests/article/utils/mockFileForm";
import { expectCode } from "tests/utils/assertions";
import { createUploadDir, expectFile, removeUploadDir, touchFile } from "tests/utils/fs";

let server: FastifyInstance;

beforeEach(async () => {
  await createUploadDir();
});


afterEach(async () => {

  await removeUploadDir();

  await server.close();
});

async function prepare(handler: RouteHandlerMethod) {

  const testPath = "/teststorage";

  server = await createTestServer(async (s) => {
    s.register(async (s) => s.post(testPath, {}, handler));
  });

  return function(args: Omit<InjectOptions, "method" | "path">) {
    return server.inject({
      method: "POST",
      path: testPath,
      ...args,
    });
  };
}

it("saves file", async () => {

  const call = await prepare(async (req) => {
    const file = await req.file();
    await server.storage.saveFile(file.filename, file.file);
    return {};
  });

  const filename = "test.pdf";
  const size = 10 * 1024;
  const form = mockFileForm(size, filename);
  const resp = await call({
    payload: form,
    headers: form.getHeaders(),
  });

  expectCode(resp, 200);

  const f = await expectFile(filename, true);

  expect(f.size).toBe(size);

});

it("removes file", async () => {

  // create the file
  const filePath = "testremove.txt";

  await touchFile(filePath);

  await expectFile(filePath, true);

  const call = await prepare(async () => {
    await server.storage.removeFile(filePath);
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);
  await expectFile(filePath, false);
});

it("causes error when removing file if not exist", async () => {

  const filePath = "test.txt";

  await expectFile(filePath, false);

  const call = await prepare(async () => {
    await server.storage.removeFile(filePath);
    return {};
  });

  const resp = await call({});

  expectCode(resp, 500);
});

it("moves file",async () => {

  // create the file
  const fromPath = "test.txt";
  const toPath = "test/ok.ls";

  await touchFile(fromPath);

  await expectFile(fromPath, true);
  await expectFile(toPath, false);

  const call = await prepare(async () => {
    await server.storage.moveFile(fromPath, toPath);
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);

  await expectFile(fromPath, false);
  await expectFile(toPath, true);
});


it("rmdir",async () => {

  // create files
  const files = ["1/1/test.txt", "1/1/test1.txt", "1/2/test.txt"];

  await Promise.all(files.map((x) => touchFile(x)));


  const call = await prepare(async () => {
    await server.storage.rmdir("1");
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);

  await expectFile("1", false);
});
