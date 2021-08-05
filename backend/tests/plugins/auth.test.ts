import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/api/auth/login";
import { User } from "@/entities/User";
import { AuthOption, signUser } from "@/plugins/auth";
import { RouteHandlerMethod } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";
import { expectCode } from "tests/utils/assertions";

let server: FastifyInstance;

let users: MockUsers;
let user: User;

const testPath = "/testauth";

let token: string;

afterEach(async () => {
  await server.close();
});

const request = (token?: string) => server.inject({
  path: testPath,
  ...token ? { headers: { authorization: "bearer " + token }  } : undefined,
});

async function prepare(
  handler: RouteHandlerMethod,
  authOption: AuthOption = [api.UserRole.User]) {

  server = await createTestServer(async (s) => {
    s.register(async (s) => s.get(testPath, {
      preValidation: authOption ? [s.jwtAuth(authOption)] : undefined,
    }, handler));
  });

  users = (await createMockUsers(server));
  user = users.normalUser1;


  token = signUser(server, user);
}

it("gets the reference to the dbUser", async () => {
  await prepare(async (req) => {
    const userRef = req.dbUserRef();
    return { id: userRef.id };
  });

  expect((await request(token)).json().id).toBe(user.id);
});

it("gets the user entity", async () => {
  await prepare(async (req) => {
    const user = await req.dbUser();
    return { email: user.email };
  });

  expect((await request(token)).json().email).toBe(user.email);
});

it("rejects requests without proper role", async () => {
  await prepare(async () => ({}));

  expect((await request(token)).statusCode).toBe(200);
  expect((await request()).statusCode).toBe(401);
  expect((await request(signUser(server, users.adminUser))).statusCode).toBe(403);
});

it("allows all accesses for unauthenticated routes", async () => {
  await prepare(async () => ({}), false);
  expect((await request(token)).statusCode).toBe(200);
  expect((await request()).statusCode).toBe(200);
});
