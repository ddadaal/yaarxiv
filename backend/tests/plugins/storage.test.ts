import { FastifyInstance } from "fastify/types/instance";
import { RouteHandlerMethod } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { mockFileForm } from "tests/article/utils/mockFileForm";
import { expectCode } from "tests/utils/assertions";
import { expectFile, removeUploadDir } from "tests/utils/fs";

let server: FastifyInstance;

const testPath = "/teststorage";

afterEach(async () => {

  await removeUploadDir();

  await server.close();
});

async function prepare(handler: RouteHandlerMethod) {

  server = await createTestServer(async (s) => {
    s.register(async (s) => s.post(testPath, {}, handler));
  });
}

it("saves file", async () => {

  await prepare(async (req) => {
    const file = await req.file();
    await server.storage.saveFile(file.filename, file.file);
    return {};
  });

  const filename = "test.pdf";
  const size = 10 * 1024;
  const form = mockFileForm(size, filename);
  const resp = await server.inject({
    method: "POST",
    path: testPath,
    payload: form,
    headers: form.getHeaders(),
  });

  expectCode(resp, 200);

  const f = await expectFile(filename, true);

  expect(f.size).toBe(size);

});


