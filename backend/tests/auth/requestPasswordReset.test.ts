import { startApp } from "../../src/app";
import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/auth/requestPasswordReset";
import { createTestAccount, TestAccount } from "nodemailer";
import { config } from "@/utils/config";
import { insertUserInfo, normalUser1 } from "tests/article/utils/login";
import { getRepository } from "typeorm";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";

let server: FastifyInstance;
let account: TestAccount;

beforeAll(async () => {
  // create test mail account and change config
  account = await createTestAccount();
  console.log(`Created test ethereal email account: ${account.user} and ${account.pass}`);
  config.mail = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  };
});

beforeEach(async () => {
  server = await startApp();
  await insertUserInfo();
});

afterEach(async () => {
  await server.close();
});

it("return 404 if account doesn't exist", async () => {
  const resp = await server.inject({
    ...api.endpoint,
    payload: { email: "notexist@notexist.com" },
  });

  expect(resp.statusCode).toBe(404);

});

it("sent an email containing a reset link", async () => {
  const email = normalUser1.email;
  const resp = await server.inject({
    ...api.endpoint,
    payload: { email },
  });

  expect(resp.statusCode).toBe(201);

  const repo = getRepository(ResetPasswordToken);
  const all = await repo.createQueryBuilder("a").getMany();

  expect(all.length).toBe(1);
  expect(all[0].userEmail).toBe(email);
  // TODO find a way to test whether email is sent. maybe a POP3 client
}, 20000);
