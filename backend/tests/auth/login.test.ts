import { FastifyInstance } from "fastify/types/instance";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers, normalUser1OriginalPassword, reloadEntity } from "tests/utils/data";
import { callRoute } from "@/utils/callRoute";
import { loginRoute } from "@/routes/auth/login";
import { expectCodeAndJson } from "tests/utils/assertions";
import { User } from "@/entities/User";
jest.mock("@/utils/sendEmailValidation");
import * as sendEmailValidation from "@/utils/sendEmailValidation";
import { toRef } from "@/utils/orm";
import { EmailValidationToken } from "@/entities/EmailValidationToken";
import { config } from "@/core/config";
import MockDate from "mockdate";

let server: FastifyInstance;


let users: MockUsers;
let user: User;
const password = normalUser1OriginalPassword;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
  user = users.normalUser1;
});

afterEach(async () => {
  MockDate.reset();
  jest.clearAllMocks();
  await server.close();
});

async function expectEmailSend(send: false)
async function expectEmailSend(send: true, user: User)
async function expectEmailSend(send: boolean, user?: User) {

  if (send) {
    expect(sendEmailValidation.sendEmailValidation).toHaveBeenCalledWith(
      expect.any(Object), user!.email, await user!.emailValidation!.load("token"),
    );
  } else {
    expect(sendEmailValidation.sendEmailValidation).not.toHaveBeenCalled();

  }
}

it("should login when the user exists", async () => {


  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password: normalUser1OriginalPassword },
  });

  const json = expectCodeAndJson(resp, 200);
  expect(json.name).toBe(user.name);
  expect(json.role).toBe(user.role);
});

it("should not login when the password is wrong", async () => {
  const user = users.normalUser1;

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password: normalUser1OriginalPassword + "bad" },
  });

  expectCodeAndJson(resp, 401);
});

it("rejects not validated user, and sends validation email", async () => {
  user.validated = false;
  await server.orm.em.flush();

  expect(user.emailValidation).toBeUndefined();

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password },
  });

  expect(resp.statusCode).toBe(403);
  expect(resp.json<403>().emailSent).toBeTrue();

  const em = server.orm.em.fork();

  const u = await em.findOneOrFail(User, { id: user.id });
  expect(u.emailValidation).not.toBeNull();

  await expectEmailSend(true, u);
});

it("rejects not validated user, but sends no email if the interval to the last sending is short", async () => {

  const now = new Date();

  user.validated = false;
  user.emailValidation = toRef(new EmailValidationToken(user, now));
  await server.orm.em.flush();

  MockDate.set(new Date(now.getTime() + (config.emailValidation.sendIntervalSeconds - 1) * 1000));

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password },
  });

  expect(resp.statusCode).toBe(403);
  expect(resp.json<403>().emailSent).toBeFalse();

  await reloadEntity(user);

  expect(user.emailValidation).not.toBeNull();
  await expectEmailSend(false);

});

it("rejects not validated user, sends email if the interval to the last sending is long", async () => {

  const now = new Date();

  user.validated = false;
  user.emailValidation = toRef(new EmailValidationToken(user, now));
  await server.orm.em.flush();

  MockDate.set(new Date(now.getTime() + (config.emailValidation.sendIntervalSeconds + 1) * 1000));

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password },
  });

  expect(resp.statusCode).toBe(403);
  expect(resp.json<403>().emailSent).toBeTrue();

  const em = server.orm.em.fork();

  const u = await em.findOneOrFail(User, { id: user.id });
  expect(u.emailValidation?.id).toBe(user.emailValidation!.id);
  expect(+(await u.emailValidation!.load("lastSent"))).toBe(Date.now());

  await expectEmailSend(true, u);

});

it("rejects not validated user, creates a new validation if the previous one is timeout", async () => {

  const now = new Date();

  user.validated = false;
  user.emailValidation = toRef(new EmailValidationToken(user, now));
  await server.orm.em.flush();

  MockDate.set(new Date(now.getTime() + (config.emailValidation.timeoutSeconds + 1) * 1000));

  const resp = await callRoute(server, loginRoute, {
    query: { id: user.email, password },
  });

  expect(resp.statusCode).toBe(403);
  expect(resp.json<403>().emailSent).toBeTrue();

  const em = server.orm.em.fork();

  const u = await em.findOneOrFail(User, { id: user.id });
  const validation = await u.emailValidation!.load();

  expect(validation?.id).toBe(user.emailValidation.id);
  expect(validation?.token).not.toBe(user.emailValidation.getProperty("token"));
  expect(+validation.time).toBe(Date.now());
  expect(+validation.lastSent).toBe(Date.now());

  await expectEmailSend(true, u);
});
