import { FastifyInstance } from "fastify/types/instance";
import { config } from "@/core/config";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { createMockUsers, MockUsers, reloadEntity } from "tests/utils/data";
import { Reference } from "@mikro-orm/core";
import { callRoute } from "@/utils/callRoute";
import { resetPasswordRoute } from "@/routes/auth/resetPassword";
import { createTestServer } from "tests/utils/createTestServer";
import { expectCode, expectCodeAndJson } from "tests/utils/assertions";

let server: FastifyInstance;
let users: MockUsers;

let token1: ResetPasswordToken;
let token2: ResetPasswordToken;

async function insertData() {
  // token1 is valid
  token1 = new ResetPasswordToken({
    token: "testid",
    user: Reference.create(users.normalUser1),
    time: new Date(),
  });

  // token2 is timeout
  token2 = new ResetPasswordToken({
    token: "testid2",
    user : Reference.create(users.normalUser2),
    time : new Date(),
  });

  token2.time.setTime(token2.time.getTime() - (config.resetPassword.tokenValidTimeSeconds + 1) * 1000),

  await server.orm.em.persistAndFlush([token1, token2]);
}


beforeEach(async () => {
  server = await createTestServer();
  users = await createMockUsers(server);
  await insertData();
});

afterEach(async () => {
  await server.close();
});

async function expectTokenDeleted(token: ResetPasswordToken) {
  const repo = server.orm.em.fork().getRepository(ResetPasswordToken);
  expect(await repo.findOne(token.id)).toBeNull();
}

it("returns 403 if token is timeout", async () => {

  const resp = await callRoute(server, resetPasswordRoute, {
    body: { token: token2.token, newPassword: "123" },
  });

  expectCodeAndJson(resp, 403);
  await expectTokenDeleted(token2);
});

it("changes user's password if token is valid", async () => {

  const newPassword = "newpassword";

  const resp = await callRoute(server, resetPasswordRoute, {
    body: { token: token1.token, newPassword },
  });

  expectCode(resp, 204);
  await expectTokenDeleted(token1);

  await reloadEntity(users.normalUser1);

  expect(await users.normalUser1.passwordMatch(newPassword)).toBe(true);


});

