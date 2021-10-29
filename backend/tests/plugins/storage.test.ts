import { FastifyInstance } from "fastify/types/instance";
import { InjectOptions, RouteHandlerMethod } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { mockFileForm } from "tests/article/utils/mockFileForm";
import { expectCode } from "tests/utils/assertions";
import { createUploadDir, expectFileExists,
  expectFileNotExists, removeUploadDir, touchFile } from "tests/utils/storage";

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

  const filename = "testsavefile.pdf";
  const size = 10 * 1024;
  const form = mockFileForm(size, filename);
  const resp = await call({
    payload: form,
    headers: form.getHeaders(),
  });

  expectCode(resp, 200);

  const f = await expectFileExists(filename);

  expect(f.size).toBe(size);

});

it("removes file", async () => {

  // create the file
  const filePath = "testremovefile.txt";

  await touchFile(filePath);

  await expectFileExists(filePath);

  const call = await prepare(async () => {
    await server.storage.removeFile(filePath);
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);
  await expectFileNotExists(filePath);
});

it("does not cause error when removing file if not exist", async () => {

  const filePath = "testremovefilenotexist.txt";

  await expectFileNotExists(filePath);

  const call = await prepare(async () => {
    await server.storage.removeFile(filePath);
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);
});

it("moves file",async () => {

  // create the file
  const fromPath = "testmovefile.txt";
  const toPath = "test/testmovefiletarget.ls";

  await touchFile(fromPath);

  await expectFileExists(fromPath);
  await expectFileNotExists(toPath);

  const call = await prepare(async () => {
    await server.storage.moveFile(fromPath, toPath);
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);

  await expectFileNotExists(fromPath);
  await expectFileExists(toPath);
});


it("rmdir",async () => {

  // create files
  const files = ["1/test.txt", "1/test1.txt", "2/test.txt"];

  await Promise.all(files.map((x) => touchFile(x)));


  const call = await prepare(async () => {
    await server.storage.rmdir("1");
    return {};
  });

  const resp = await call({});

  expectCode(resp, 200);

  await expectFileNotExists("1");
  await expectFileExists("2/test.txt");
});

it("serves file", async () => {
  const file = "file_to_serve.pdf";

  // write 10k content
  const size = 10 * 1024;

  await touchFile(file, Buffer.alloc(size, "0"));

  const call = await prepare(async (_req, rep) => {
    await rep.serveFile(file);
  });

  const resp = await call({});

  expectCode(resp, 200);
  expect(resp.headers["content-length"]).toBe(size);
});
