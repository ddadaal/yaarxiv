import { FastifyInstance } from "fastify/types/instance";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, reloadUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { changeProfileRoute } from "@/routes/dashboard/changeProfile";
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
  const resp = await callRoute(server, changeProfileRoute, { body: { profileChange: {} } });

  expectCodeAndJson(resp, 401);
});

it("change user profile", async () => {

  const prevJobTitle = users.normalUser1.jobTitle;
  const institution = "Peking University";

  const resp = await callRoute(server, changeProfileRoute, {
    body: { profileChange: { institution } },
  }, users.normalUser1);

  expectCode(resp, 204);

  await reloadUsers(users);

  expect(users.normalUser1.institution).toBe(institution);
  expect(users.normalUser1.jobTitle).toBe(prevJobTitle);
});
