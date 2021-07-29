import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/api/dashboard/getAccountInfo";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute";
import { getAccountInfoRoute } from "@/routes/dashboard/getAccountInfo";
import { createMockUsers, MockUsers, reloadUsers } from "tests/utils/data";
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

  await reloadUsers(users);

  expectCodeAndJson(resp, 401);
});

it("return user profile", async () => {
  const resp = await callRoute(server, getAccountInfoRoute, {
  }, users.normalUser1);

  expectCodeAndJson(resp, 200);
  const data = resp.json<200>();
  expect(data.name).toBe(users.normalUser1.name);
  expect(data.userId).toBe(users.normalUser1.id);
  expect(data.email).toBe(users.normalUser1.email);
});
