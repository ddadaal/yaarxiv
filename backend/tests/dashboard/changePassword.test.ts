import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/api/dashboard/changePassword";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, normalUser1OriginalPassword, reloadUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { changePasswordRoute } from "@/routes/dashboard/changePassword";
import { expectCodeAndJson } from "tests/utils/assertions";

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
  const resp = await server.inject({ ...api.endpoint });

  expectCodeAndJson(resp, 401);
});

it("change user password", async () => {

  const newPassword = "newPassword";

  const resp = await callRoute(server, changePasswordRoute, {
    body: {
      current: normalUser1OriginalPassword,
      changed: newPassword,
    },
  }, users.normalUser1);

  expectCodeAndJson(resp, 204);

  await reloadUsers(users);

  expect(await users.normalUser1.passwordMatch(newPassword)).toBe(true);

});

it("403 if the original password is not correct", async () => {
  const resp = await callRoute(server, changePasswordRoute, {
    body: {
      current: normalUser1OriginalPassword + "123",
      changed: normalUser1OriginalPassword + "1234",
    },
  }, users.normalUser1);

  expectCodeAndJson(resp, 403);
});
