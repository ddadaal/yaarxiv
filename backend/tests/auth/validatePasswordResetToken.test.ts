import { FastifyInstance } from "fastify/types/instance";
import { config } from "@/core/config";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { genId } from "@/utils/genId";
import { createTestServer } from "tests/utils/createTestServer";
import { MockUsers, createMockUsers } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { validatePasswordResetTokenRoute } from "@/routes/auth/validatePasswordResetToken";
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

async function insert(token: string, time: Date) {
  const tokenEntity = new ResetPasswordToken({
    token,
    time: time,
    user: users.normalUser1,
  });

  await server.orm.em.persistAndFlush(tokenEntity);
}

it("returns invalid if token does not exist", async () => {
  await insert(genId(), new Date());

  const resp = await callRoute(server, validatePasswordResetTokenRoute, {
    query: { token: "123" },
  });

  expect(expectCodeAndJson(resp, 200).valid).toBe(false);

});

it("returns invalid if token is timeout", async () => {
  const token = genId();
  const time = new Date();
  // subtract 1000ms more that invalid time
  time.setTime(time.getTime() - (config.resetPassword.tokenValidTimeSeconds + 1)* 1000);
  await insert(token, time);

  const resp = await callRoute(server, validatePasswordResetTokenRoute, {
    query: { token: token },
  });

  expect(expectCodeAndJson(resp, 200).valid).toBe(false);
});

it("returns valid if token is not timeout", async () => {
  const token = genId();
  const time = new Date();
  time.setTime(time.getTime() - (config.resetPassword.tokenValidTimeSeconds - 100)* 1000 - 1000);
  await insert(token, time);

  const resp = await callRoute(server, validatePasswordResetTokenRoute, {
    query: { token: token },
  });

  expect(expectCodeAndJson(resp, 200).valid).toBe(true);
});
