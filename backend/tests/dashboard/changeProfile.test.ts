import { FastifyInstance } from "fastify/types/instance";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, reloadUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { changeProfileRoute } from "@/routes/dashboard/changeProfile";

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
  const resp = await callRoute(server, changeProfileRoute, { body: {} });

  expect(resp.statusCode).toBe(401);
});

it("change user profile", async () => {

  const newEmail = "testupdated@test.com";

  const resp = await callRoute(server, changeProfileRoute, {
    body: { email: newEmail },
  }, users.normalUser1);

  expect(resp.statusCode).toBe(204);

  await reloadUsers(users);

  expect(users.normalUser1.email).toBe(newEmail);
});
