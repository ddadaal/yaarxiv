import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/admin/getUsers";
import { adminUser, login, normalUser1, normalUser2 } from "../article/utils/login";
import { createMockArticles } from "tests/article/utils/data";

const articleCount = 3;

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await createMockArticles(articleCount);

});

afterEach(async () => {
  await server.close();
});

it("should return all users", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
  const data = resp.json() as api.AdminGetUsersSchema["responses"]["200"];

  expect(data.totalCount).toBe(3);
  expect(data.users).toHaveLength(3);
  expect(data.users).toEqual(expect.arrayContaining([
    { id: adminUser.id, name: adminUser.name, role: adminUser.role, email: adminUser.email, articleCount: 0 },
    { id: normalUser1.id, name: normalUser1.name, role: normalUser1.role, email: normalUser1.email, articleCount: 2 },
    { id: normalUser2.id, name: normalUser2.name, role: normalUser2.role, email: normalUser2.email, articleCount: 1 },
  ] as api.AdminGetUsersResult[]));
});

it("should filter users by name", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
    query: { searchWord: normalUser1.name.substr(1, normalUser1.name.length - 2) },
  });

  expect(resp.statusCode).toBe(200);
  const data = resp.json() as api.AdminGetUsersSchema["responses"]["200"];

  expect(data.totalCount).toBe(2);
  expect(data.users).toHaveLength(2);
  expect(data.users).toEqual(expect.arrayContaining([
    { id: normalUser1.id, name: normalUser1.name, role: normalUser1.role, email: normalUser1.email, articleCount: 2 },
    { id: normalUser2.id, name: normalUser2.name, role: normalUser2.role, email: normalUser2.email, articleCount: 1 },
  ] as api.AdminGetUsersResult[]));
});

it("should filter users by incomplete email", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, adminUser),
    query: { searchWord: normalUser1.email.substr(1, normalUser1.email.length - 2) },
  });

  expect(resp.statusCode).toBe(200);
  const data = resp.json() as api.AdminGetUsersSchema["responses"]["200"];

  expect(data.totalCount).toBe(1);
  expect(data.users).toHaveLength(1);
  expect(data.users).toEqual([
    { id: normalUser1.id, name: normalUser1.name, role: normalUser1.role, email: normalUser1.email, articleCount: 2 },
  ] as api.AdminGetUsersResult[]);
});

it("return 401 if not login.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);

});

it("return 403 if not admin", async () => {
  const resp = await server.inject({
    ...api.endpoint ,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
});

