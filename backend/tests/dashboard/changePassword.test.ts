import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/dashboard/changePassword";
import { insertUserInfo, login, normalUser1, normalUser1OriginalPassword } from "../article/utils/login";
import { compare } from "@/utils/bcrypt";
import { getRepository } from "typeorm";
import { User } from "@/entities/User";

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

it("change user password", async () => {

  const newPassword = "newPassword";

  const resp = await server.inject({
    ...api.endpoint,
    payload: {
      current: normalUser1OriginalPassword,
      changed: newPassword,
    },
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);

  const userRepo = getRepository(User);

  const user = await userRepo.findOne(normalUser1.id);
  expect(user).not.toBeUndefined();
  expect(await compare(newPassword, user!.password)).toBe(true);

});

it("403 if the original password is not correct", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    payload: {
      current: normalUser1.password,
      changed: normalUser1.password + "123",
    },
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(403);
});
