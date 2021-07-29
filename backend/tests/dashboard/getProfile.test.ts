import { FastifyInstance } from "fastify/types/instance";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute";
import { getProfileRoute } from "@/routes/dashboard/getProfile";
import { createMockUsers, MockUsers } from "tests/utils/data";
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
  const resp = await callRoute(server, getProfileRoute, {});

  expectCodeAndJson(resp, 401);
});

it("return user profile", async () => {
  const resp = await callRoute(server, getProfileRoute, {
  }, users.normalUser1);

  expectCodeAndJson(resp, 200);
  const data = resp.json<200>();

  expect(data).toEqual({
    academicKeywords: users.normalUser1.academicKeywords,
    researchLabels: users.normalUser1.researchLabels,
    honor: users.normalUser1.honor,
    honorPublic: users.normalUser1.honorPublic,
    institution: users.normalUser1.institution,
    institutionPublic: users.normalUser1.institutionPublic,
    jobTitle: users.normalUser1.jobTitle,
    jobTitlePublic: users.normalUser1.jobTitlePublic,
  });
});
