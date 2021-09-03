import { FastifyInstance } from "fastify/types/instance";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, reloadUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { changeAccountInfoRoute } from "@/routes/dashboard/changeAccountInfo";
import { expectCode, expectCodeAndJson } from "tests/utils/assertions";

let server: FastifyInstance;
let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);

});

afterEach(async () => {
  await server.close();
});

it("return 401 if not logged in.", async () => {
  const resp = await callRoute(server, changeAccountInfoRoute, { body: {} });

  expectCodeAndJson(resp, 401);
});

it("change user profile", async () => {

  const newName = "newname";

  const resp = await callRoute(server, changeAccountInfoRoute, {
    body: { name: newName },
  }, users.normalUser1);

  expectCode(resp, 204);

  await reloadUsers(users);

  expect(users.normalUser1.name).toBe(newName);
});
