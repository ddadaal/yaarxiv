import { FastifyInstance } from "fastify/types/instance";
import { createTestAccount, TestAccount } from "nodemailer";
import { config } from "@/utils/config";
import { ResetPasswordToken } from "@/entities/ResetPasswordToken";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { createTestServer } from "tests/utils/createTestServer";
import { callRoute } from "@/utils/callRoute";
import { requestPasswordResetRoute } from "@/routes/auth/requestPasswordReset";
import { expectCode } from "tests/utils/assertions";

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
    from: "yaarxiv",
    ignoreError: false,
  };
});

let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
});

afterEach(async () => {
  await server.close();
});

it("return 404 if account doesn't exist", async () => {
  const resp = await callRoute(server, requestPasswordResetRoute, {
    body: { email: "notexist@notexist.com" },
  });

  expectCode(resp, 404);

});

it("sent an email containing a reset link", async () => {
  const email = users.normalUser1.email;

  const resp = await callRoute(server, requestPasswordResetRoute, {
    body: { email },
  });

  expectCode(resp, 201);

  const em = server.orm.em.fork();

  const repo = em.getRepository(ResetPasswordToken);
  const all = await repo.findAll();

  expect(all.length).toBe(1);
  expect(await all[0].user.load("email")).toBe(email);
  // TODO find a way to test whether email is sent. maybe a POP3 client
}, 20000);
