import { User } from "@/entities/User";
import { registerUserRoute } from "@/routes/register/register";
import { callRoute } from "@/utils/callRoute";
import { FastifyInstance } from "fastify/types/instance";
import { expectCodeAndJson } from "tests/utils/assertions";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";

let server: FastifyInstance;
let users: MockUsers;

beforeEach(async () => {
  server = await createTestServer();

  users = await createMockUsers(server);
});

afterEach(async () => {
  await server.close();
});

const email = "test@test.com";
const password = "testpassword";

it("registers and sends validation email", async () => {

  const resp = await callRoute(server, registerUserRoute, {
    body: { email, password  },
  });

  expectCodeAndJson(resp, 201);

  const em = server.orm.em.fork();

  const user = await em.findOneOrFail(User, { email });

  expect(await user.passwordMatch(password)).toBeTrue();

  expect(user.validated).toBeFalse();

  expect(user.emailValidation).toBeDefined();

  expect(server.sendMail).toHaveBeenCalledWith(expect.objectContaining({
    to: email,
  }));
});

it("should error if one email registers twice", async () => {

  const resp = await callRoute(server, registerUserRoute, {
    body: { email: users.normalUser1.email, password  },
  });

  expectCodeAndJson(resp, 405);
});

it("should fail if input email is not a valid email address", async () => {
  const resp = await callRoute(server, registerUserRoute, {
    body: { email: "123", password  },
  });

  expectCodeAndJson(resp, 400);
});
