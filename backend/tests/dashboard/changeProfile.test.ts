/* eslint-disable  */
import { FastifyInstance } from "fastify/types/instance";
import { startApp } from "../../src/app";
import * as api from "yaarxiv-api/dashboard/changeProfile";
import { insertUserInfo, login, normalUser1 } from "../article/utils/login";
import { getRepository } from "typeorm";
import { User } from "@/entities/User";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();

  await insertUserInfo();
});

afterEach(async () => {
  await server.close();
})

it("return 401 if not logged in.", async () => {
  const resp = await server.inject({ ...api.endpoint });

  expect(resp.statusCode).toBe(401);
});

it("change user profile", async () => {

  const newEmail = "testupdated@test.com";

  const resp = await server.inject({
    ...api.endpoint,
    payload: { email: newEmail },
    ...login(server, normalUser1),
  });

  expect(resp.statusCode).toBe(200);

  const userRepo = getRepository(User);

  const user = await userRepo.findOne(normalUser1.id);
  expect(user).not.toBeUndefined();
  expect(user!.email).toBe(newEmail);
  expect(user!.name).toBe(normalUser1.name);
  expect(user!.id).toBe(normalUser1.id);

});
