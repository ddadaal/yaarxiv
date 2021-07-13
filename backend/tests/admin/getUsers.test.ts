import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/api/admin/getUsers";
import { createMockArticles } from "tests/article/utils/generateArticles";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute";
import { adminGetUsersRoute } from "@/routes/admin/getUsers";
import { User } from "@/entities/User";
import { expectCodeAndJson } from "tests/utils/assertions";

const articleCount = 3;

let server: FastifyInstance;

let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  await createMockArticles(server, articleCount, users);
});


afterEach(async () => {
  await server.close();
});

function toInfo(user: User, articleCount: number) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    articleCount,
  };
}

it("should return all users", async () => {
  const resp = await callRoute(server, adminGetUsersRoute, { query: {} }, users.adminUser);

  expectCodeAndJson(resp, 200);
  const data = resp.json<200>();

  expect(data.totalCount).toBe(3);
  expect(data.users).toHaveLength(3);


  expect(data.users).toEqual(expect.arrayContaining([
    toInfo(users.adminUser, 0),
    toInfo(users.normalUser1, 2),
    toInfo(users.normalUser2, 1),
  ] as api.AdminGetUsersResult[]));
});

it("should filter users by name", async () => {

  const resp = await callRoute(server, adminGetUsersRoute, {
    query: { searchWord: users.normalUser1.name.substr(1, users.normalUser1.name.length - 2) },
  }, users.adminUser);

  expectCodeAndJson(resp, 200);
  const data = resp.json<200>();

  expect(data.totalCount).toBe(2);
  expect(data.users).toHaveLength(2);
  expect(data.users).toEqual(expect.arrayContaining([
    toInfo(users.normalUser1, 2),
    toInfo(users.normalUser2, 1),
  ] as api.AdminGetUsersResult[]));
});

it("should filter users by incomplete email", async () => {
  const resp = await callRoute(server, adminGetUsersRoute, {
    query: { searchWord: users.normalUser1.email.substr(1, users.normalUser1.email.length - 2) },
  }, users.adminUser);

  expectCodeAndJson(resp, 200);
  const data = resp.json<200>();

  expect(data.totalCount).toBe(1);
  expect(data.users).toHaveLength(1);
  expect(data.users).toEqual([
    toInfo(users.normalUser1, 2),
  ] as api.AdminGetUsersResult[]);
});

it("return 401 if not login.", async () => {
  const resp = await callRoute(server, adminGetUsersRoute, { query: {} });

  expectCodeAndJson(resp, 401);

});

it("return 403 if not admin", async () => {
  const resp = await callRoute(server, adminGetUsersRoute, { query: {} }, users.normalUser1);

  expectCodeAndJson(resp, 403);
});

