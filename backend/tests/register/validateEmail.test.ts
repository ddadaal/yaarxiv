import { User, UserRole } from "@/entities/User";
import { callRoute } from "@/utils/callRoute";
import { FastifyInstance } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { EmailValidationToken } from "@/entities/EmailValidationToken";
import { validateEmailRoute } from "@/routes/register/validateEmail";
import MockDate from "mockdate";
import { config } from "@/utils/config";

let server: FastifyInstance;
let user: User;
let token: EmailValidationToken;

beforeEach(async () => {
  server = await createTestServer();

  user = new User({
    email: "test@test.com",
    name: "test",
    role: UserRole.User,
    password: "test",
  });

  expect(user.validated).toBeFalse();

  // insert the token
  token = new EmailValidationToken(user);

  await server.orm.em.persistAndFlush([user, token]);
});

afterEach(async () => {
  await server.close();
});

it("validates the user", async () => {
  const resp = await callRoute(server, validateEmailRoute, {
    body: { token: token.token },
  }, user);

  expect(resp.statusCode).toBe(201);

  const em = server.orm.em.fork();

  const u = await em.findOneOrFail(User, { id: user.id });

  expect(u.validated).toBeTrue();
  expect(await em.findOne(EmailValidationToken, { token: token.token })).toBeNull();
});

it("fails with bad token", async () => {
  const resp = await callRoute(server, validateEmailRoute, {
    body: { token: token.id + "bad" },
  }, user);

  expect(resp.statusCode).toBe(403);

  const em = server.orm.em.fork();

  const u = await em.findOneOrFail(User, { id: user.id });

  expect(u.validated).toBeFalse();
});

it("fails with timed out token", async () => {
  MockDate.set(token.time.getTime() + (config.emailValidation.timeoutSeconds + 1) * 1000);

  const resp = await callRoute(server, validateEmailRoute, {
    body: { token: token.token },
  }, user);

  expect(resp.statusCode).toBe(403);

  const em = server.orm.em.fork();

  const u = await em.findOneOrFail(User, { id: user.id });

  expect(u.validated).toBeFalse();
  expect(await em.findOne(EmailValidationToken, { token: token.token })).toBeNull();

  MockDate.reset();

});
