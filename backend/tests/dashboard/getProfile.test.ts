import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/dashboard/getProfile";
import { insertUserInfo, login, normalUser1 } from "../article/utils/login";


let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertUserInfo();
});

afterEach(async () => {
  await server.close();
});
it("return 401 if not logged in.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);
});

it("return user profile", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);
  const data = resp.json() as api.DashboardGetProfileSchema["responses"]["200"];
  expect(data.name).toBe(normalUser1.name);
  expect(data.userId).toBe(normalUser1.id);
  expect(data.email).toBe(normalUser1.email);
});
