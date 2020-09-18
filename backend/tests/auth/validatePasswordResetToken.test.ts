import { startApp } from "../../src/app";
import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/auth/validatePasswordResetToken";
import { config } from "@/utils/config";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { genId } from "@/utils/genId";

let server: FastifyInstance;

beforeEach(async () => {
  server = await startApp();
});

afterEach(async () => {
  await server.close();
});

async function insert(id: string, time: Date) {
  const em =server.orm.em.fork();
  const repo = em.getRepository(ResetPasswordToken);
  const token = new ResetPasswordToken();
  token.id = id;
  token.time = time;
  token.userEmail = "test@test.com";
  await repo.persistAndFlush(token);
}

it("returns invalid if token does not exist", async () => {
  await insert(genId(), new Date());

  const resp = await server.inject({
    ...api.endpoint,
    query: { token: "123" },
  });

  expect(resp.json().valid).toBe(false);

});

it("returns invalid if token is timeout", async () => {
  const token = genId();
  const time = new Date();
  // subtract 1000ms more that invalid time
  time.setTime(time.getTime() - (config.resetPassword.tokenValidTimeSeconds + 1)* 1000);
  await insert(token, time);

  const resp = await server.inject({
    ...api.endpoint,
    query: { token: token },
  });

  expect(resp.json().valid).toBe(false);
});

it("returns valid if token is not timeout", async () => {
  const token = genId();
  const time = new Date();
  time.setTime(time.getTime() - (config.resetPassword.tokenValidTimeSeconds - 100)* 1000 - 1000);
  await insert(token, time);

  const resp = await server.inject({
    ...api.endpoint,
    query: { token: token },
  });

  expect(resp.json().valid).toBe(true);
});
