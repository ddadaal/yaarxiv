import { FastifyInstance } from "fastify/types/instance";
import * as api from "yaarxiv-api/api/auth/login";
import { User } from "@/entities/User";
import { AuthOption, JwtTokenPayload, signUser } from "@/plugins/auth";
import { RouteHandlerMethod } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import { createMockUsers, MockUsers } from "tests/utils/data";

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
  authOption: AuthOption | null = [api.UserRole.User]) {

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

it("decodes token info", async () => {

  const error = { error: "nothing" };

  await prepare(async (req) => {
    const { token } = req.query as { token?: string };
    return token ? req.server.jwtTryDecodeToken(token) : error;
  }, null);

  const request = (token?: string) =>
    server.inject({ path: testPath, query: token ? { token } : undefined });

  expect((await request(token)).json()).toMatchObject({
    id: user.id,
    role: user.role,
  } as JwtTokenPayload);

  expect((await request()).json()).toEqual(error);
});
