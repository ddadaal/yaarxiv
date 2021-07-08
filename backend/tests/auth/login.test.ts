import { FastifyInstance } from "fastify/types/instance";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, normalUser1OriginalPassword } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { loginRoute } from "@/routes/auth/login";
import { expectCode } from "tests/utils/assertions";

let server: FastifyInstance;

let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
});

afterEach(async () => {
  await server.close();
});

it("should login when the user exists", async () => {

  const user = users.normalUser1;

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password: normalUser1OriginalPassword },
  });

  const json = expectCode(resp, 200);
  expect(json.name).toBe(user.name);
  expect(json.role).toBe(user.role);
});

it("should not login when the password is wrong", async () => {
  const user = users.normalUser1;

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.id + "", password: normalUser1OriginalPassword + "bad" },
  });

  expectCode(resp, 401);
});
