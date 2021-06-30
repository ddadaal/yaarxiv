import { startApp, startServer } from "../../src/app";
import { FastifyInstance } from "fastify";
import { signUser } from "@/plugins/auth";
import { adminUser, login, normalUser1 } from "tests/article/utils/login";
import { createMockArticles } from "tests/article/utils/data";

let server: FastifyInstance;

const testApiEndpoint = {
  method: "GET",
  path: "/fortesting",
} as const;

beforeEach(async () => {
  server = await startApp(false);

  // add a endpoint
  server.get(testApiEndpoint.path, { preValidation: server.jwtAuth(["admin"]) }, async (req) => {
    const user = await req.dbUser();
    return { userId: user.id };
  });

  await startServer(server);
  await createMockArticles(0);
});

afterEach(async () => {
  await server.close();
});

function getAuthorizationHeaderObject(token: string) {
  return {
    headers: {
      authorization: "bearer "+ token,
    },
  };
}

it("return 401 if token is invalid", async () => {
  const invalidToken = "invalidToken";

  const resp = await server.inject({
    ...testApiEndpoint,
    ...getAuthorizationHeaderObject(invalidToken),
  });

  expect(resp.statusCode).toBe(401);
});

it("return 401 if the user of token does not exist", async () => {
  const token = signUser(server, { id: normalUser1.id + "notvalid", role: "admin" });

  console.log(token);

  const resp = await server.inject({
    ...testApiEndpoint,
    ...getAuthorizationHeaderObject(token),
  });

  expect(resp.statusCode).toBe(401);

});

it("should 403 if the role does not match", async () => {
  const token = signUser(server, normalUser1);

  const resp = await server.inject({
    ...testApiEndpoint,
    ...getAuthorizationHeaderObject(token),
  });

  expect(resp.statusCode).toBe(403);
});

it("should pass if the user satisfies requirements", async () => {
  const resp = await server.inject({
    ...testApiEndpoint,
    ...login(server, adminUser),
  });

  expect(resp.statusCode).toBe(200);
});
