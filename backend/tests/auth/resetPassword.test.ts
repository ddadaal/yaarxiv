
import { startApp } from "../../src/app";
import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/auth/resetPassword";
import { config } from "@/utils/config";
import { getRepository } from "typeorm";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { insertUserInfo, normalUser1 } from "tests/article/utils/login";
import { User } from "@/entities/User";

let server: FastifyInstance;

const targetUser = normalUser1;
let token1: ResetPasswordToken;
let token2: ResetPasswordToken;
let token3: ResetPasswordToken;

async function insertData() {
  const repo = getRepository(ResetPasswordToken);

  // token1 is valid
  token1 = new ResetPasswordToken();
  token1.id = "testid";
  token1.userEmail = targetUser.email;
  token1.time = new Date();

  // token2 is timeout
  token2 = new ResetPasswordToken();
  token2.id = "testid2";
  token2.userEmail = targetUser.email;
  token2.time = new Date();
  token2.time.setTime(token2.time.getTime() - (config.resetPassword.tokenValidTimeSeconds + 1) * 1000);

  // token3's user does not exist.
  token3 = new ResetPasswordToken();
  token3.id = "testid3";
  token3.userEmail = "notexist@test.com";
  token3.time = new Date();

  await repo.save([token1, token2, token3]);
}


beforeEach(async () => {
  server = await startApp();
  await insertUserInfo();
  await insertData();
});

afterEach(async () => {
  await server.close();
});

async function expectTokenDeleted(token: ResetPasswordToken) {
  const repo = getRepository(ResetPasswordToken);
  expect(await repo.findOne(token.id)).toBeUndefined();
}

it("returns 403 if token does not exist", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    payload: { token: token3.id + "bad", newPassword: "123" },
  });

  expect(resp.statusCode).toBe(403);

});

it("returns 403 if token is timeout", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    payload: { token: token2.id, newPassword: "123" },
  });

  expect(resp.statusCode).toBe(403);
  await expectTokenDeleted(token2);
});

it("returns 403 if user does not exist", async () => {

  const resp = await server.inject({
    ...api.endpoint,
    payload: { token: token3.id, newPassword: "123" },
  });

  expect(resp.statusCode).toBe(403);
  await expectTokenDeleted(token3);
});

it("changes user's password if token is valid", async () => {

  const newPassword = "newpassword";

  const resp = await server.inject({
    ...api.endpoint,
    payload: { token: token1.id, newPassword },
  });

  expect(resp.statusCode).toBe(201);
  await expectTokenDeleted(token1);

  const userRepo = getRepository(User);
  const user = await userRepo.findOne(targetUser.id);
  if (!user) {
    throw new Error("user is undefined");
  }
  expect(await user.passwordMatch(newPassword)).toBe(true);


});

